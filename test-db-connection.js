
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function run() {
    console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ':****@')); // Hide password

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000
    });

    try {
        console.log("Connecting...");
        await client.connect();
        console.log("Connected successfully to server");
        await client.db("admin").command({ ping: 1 });
        console.log("Ping confirmed.");
    } catch (err) {
        console.error("Connection failed!");
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
