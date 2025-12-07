import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'agritech_db';

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
}

async function testConnection() {
    console.log('Attempting to connect to MongoDB...');
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        const db = client.db(DB_NAME);
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await client.close();
    }
}

testConnection();
