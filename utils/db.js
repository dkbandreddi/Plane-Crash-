const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1";
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("PlaneCrash");
    console.log("DB connection established successfully");
    console.log("Visit http://localhost:8080")
  } catch (err) {
    throw `There was an error when connecting to DB... ${err}`;
  }
}

async function getDb() {
  return db;
}

async function closeDB() {
  await client.close();
}

module.exports = { connectDB, getDb, closeDB };
