
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env file");
}

const client = new MongoClient(uri);

let database;

async function connectDB() {
  try {
    await client.connect();

    database = client.db("togetherwe");

    console.log("MongoDB connected successfully!");

    return database;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw new Error("Database is not connected yet");
  }

  return database;
}

module.exports = { connectDB, getDB };

