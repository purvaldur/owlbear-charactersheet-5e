import 'dotenv/config';
import * as util from 'util';
import sdk from 'node-appwrite';

const client = new sdk.Client();
const database = "owlbear"
const collection = process.env.ENV === 'DEV' ? 'devsheets' : 'charsheets'
// const collection = 'charsheets'

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('owlbear')
    .setKey(process.env.APPWRITE_API_KEY)
;

const databases = new sdk.Databases(client);

export async function getUser(id) {
  return await databases.listDocuments(
    database,
    collection,
    [
      sdk.Query.equal("user_id", [id])
    ]
  )
}

export async function createUser(data) {
  let char = JSON.parse(data.characters)
  return await databases.createDocument(
    database,
    collection,
    sdk.ID.unique(),
    {
      user_id: data.id,
      characters: data.characters,
      user_name: data.name,
      first_char: JSON.parse(data.characters).list[0].name
    }
  )
}

export async function updateUser(data) {
  try {
    let document = await getUser(data.id)
    let char = JSON.parse(data.characters)
    return await databases.updateDocument(
      database,
      collection,
      document.documents[0].$id,
      {
        user_id: data.id,
        characters: data.characters,
        user_name: data.name,
        first_char: char.list[0].name
      }
    )
  } catch (e) {
    console.log(e);
    return "error: check logs"
  }
}

async function generalUpdate() {
  const docs = await databases.listDocuments(
    database,
    collection,
    [
      sdk.Query.limit(100)
    ]
  )

  for (let doc of docs.documents) {
    const docID = doc.$id
    let characters = JSON.parse(doc.characters)
    let updatedChars = []

    for (let character of characters.list) {
      if (!character.storage) {
        console.log(character.name + " does not have storage");
        console.log(character.storage);
        character.storage = {
          money: {
            cp: 0,
            sp: 0,
            ep: 0,
            gp: 0,
            pp: 0
          },
          equipment: [
            {
              amount: 1,
              name: 'Backpack',
              weight: "5lbs",
              value: "2gp"
            }
          ],
        }
        updatedChars.push(character.name)
      }
    }

    if (updatedChars.length > 0) {
      console.log(characters);
      doc.characters = JSON.stringify(characters)
      await databases.updateDocument(
        database,
        collection,
        docID,
        {
          characters: doc.characters
        }
      )
      console.log("Updated " + updatedChars.join(", "))
    }
  }
}

// generalUpdate()