// This file is adapted from the official MongoDB documentation for connecting to a MongoDB database in a Node.js environment.
// It is MongoDB Connection code for a Next.js application.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const options = {}; // Add any MongoClient options if needed
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if(!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri, options);
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;