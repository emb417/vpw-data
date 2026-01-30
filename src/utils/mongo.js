import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";
import logger from "./logger.js";

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@cluster0.blwxx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&connectTimeoutMS=10000`;

let client = null;
let db = null;

const initDb = async () => {
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });

  let attempts = 0;
  let delay = 1000;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      await client.connect();
      db = client.db(DB_NAME);
      logger.info("[Mongo] Connected successfully to database");
      return;
    } catch (err) {
      attempts++;
      if (attempts >= maxAttempts) {
        logger.error(
          `[Mongo] Failed to connect after ${maxAttempts} attempts: ${err.message}`,
        );
        throw err;
      }
      logger.error(
        `[Mongo] Connection failed (attempt ${attempts}/${maxAttempts}), retrying in ${delay / 1000}s: ${err.message}`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, 30000);
    }
  }
};

const getDb = async () => {
  if (!db) {
    throw new Error("[Mongo] Database not initialized. Call initDb() first.");
  }
  return db;
};

const closeDb = async () => {
  if (client) {
    await client.close();
    logger.info("[Mongo] Connection closed");
  }
};

export { initDb, getDb, closeDb, ObjectId };