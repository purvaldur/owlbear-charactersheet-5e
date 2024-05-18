import 'dotenv/config';
import * as util from 'util';
import sdk from 'node-appwrite';

const client = new sdk.Client();
const database = "owlbear"
const collection = process.env.ENV === 'DEV' ? 'devsheets' : 'charsheets'

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
  return await databases.createDocument(
    database,
    collection,
    sdk.ID.unique(),
    {
      user_id: data.id,
      characters: data.characters,
      user_name: data.name
    }
  )
}

export async function updateUser(data) {
  const document = await (await getUser(data.id)).documents[0].$id
  return await databases.updateDocument(
    database,
    collection,
    document,
    {
      user_id: data.id,
      characters: data.characters,
      user_name: data.name
    }
  )
}

async function generalUpdate() {
  const docs = await databases.listDocuments(
    database,
    collection,
    []
  )

  for (let user of docs.documents) {
    const docID = user.$id
    let characters = JSON.parse(user.characters)

    for (let character of characters.list) {
      character.storage = {
        money: {
          copper: 0,
          silver: 0,
          electrum: 0,
          gold: 0,
          platinum: 0
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
    }

    user.characters = JSON.stringify(characters)

    console.log(docID);

    await databases.updateDocument(
      database,
      collection,
      docID,
      {
        characters: user.characters
      }
    )
  }
}

// generalUpdate()