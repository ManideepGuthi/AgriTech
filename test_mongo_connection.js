import { MongoClient, ServerApiVersion } from 'mongodb';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("URI:", uri);

const hostname = 'ac-oz5blm0-shard-00-00.fyy2wom.mongodb.net';

console.log(`Attempting to resolve ${hostname}...`);
dns.lookup(hostname, (err, address, family) => {
    if (err) {
        console.error("DNS Lookup failed:", err);
    } else {
        console.log("DNS Lookup success:", address, "Family:", family);
    }
});

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
});

client.on('serverDescriptionChanged', (event) => console.log('Server description changed:', event.newDescription.type));
client.on('serverHeartbeatStarted', (event) => console.log('Heartbeat started:', event.connectionId));
client.on('serverHeartbeatSucceeded', (event) => console.log('Heartbeat succeeded:', event.connectionId));
client.on('serverHeartbeatFailed', (event) => console.log('Heartbeat failed:', event.failure));

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Connected successfully to server");
        await client.close();
    } catch (err) {
        console.error("Connection failed details:", JSON.stringify(err, null, 2));
    }
}

run();
