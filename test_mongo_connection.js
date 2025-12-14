import { MongoClient, ServerApiVersion } from 'mongodb';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("URI:", uri);

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
});

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Connected successfully to server");
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await client.close();
    } catch (err) {
        console.error("Connection failed details:", err);
    }
}

run();
