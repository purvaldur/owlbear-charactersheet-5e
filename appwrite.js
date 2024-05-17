import 'dotenv/config';
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
      characters: data.characters
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
      characters: data.characters
    }
  )
}