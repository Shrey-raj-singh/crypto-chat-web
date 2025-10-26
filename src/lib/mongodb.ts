import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect(); // returns a Promise<MongoClient>

export default clientPromise; // default export for MongoDBAdapter
