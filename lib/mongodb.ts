import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI as string;
const options = {};

let client;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

client = new MongoClient(uri, {});
let clientPromise = client.connect();

export default clientPromise;
