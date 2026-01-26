import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.blwxx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

let dbInstance = null;

const getDb = async () => {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(DB_NAME);
  }
  return dbInstance;
};

const getCollection = async (collectionName) => {
  const db = await getDb();
  const collections = await db.collections();
  if (
    !collections.some(
      (collection) => collection.collectionName === collectionName,
    )
  ) {
    db.createCollection(collectionName);
  }

  return db.collection(collectionName);
};

const insertOne = async (doc, collectionName) => {
  const db = await getDb();
  const collection = await getCollection(collectionName);
  await collection.insertOne(doc);
};

const find = async (filter, collectionName) => {
  const db = await getDb();
  const collection = await getCollection(collectionName);
  const docs = await collection.find(filter).toArray();
  return docs;
};

const deleteOne = async (filter, options, collectionName) => {
  const db = await getDb();
  const collection = await getCollection(collectionName);
  await collection.deleteOne(filter, options);
};

export default {
  getCollection,
  insertOne,
  find,
  deleteOne,
};

export { ObjectId };
