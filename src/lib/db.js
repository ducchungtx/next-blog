// mongodb+srv://<db_username>:<db_password>@cluster0.8rown.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// nextjs_learn oMrMEfZNznh1lSWj
import "server-only";
import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.DB_URI) {
  throw new Error('Please define the DB_URI environment variable inside .env.local');
}

const client = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true, // removes a deprecation warning when connecting
  useUnifiedTopology: true, // removes a deprecation warning when connecting 
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getDB(dbName) {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {

  }
}

export async function getCollection(collectionName) {
  const db = await getDB('nextjs_learn');
  if (db) {
    return db.collection(collectionName);
  }
  return null;
}