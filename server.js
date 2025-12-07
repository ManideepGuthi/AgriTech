import express from "express";
import cors from "cors";
import { MongoClient } from 'mongodb';
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'agritech_db';

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

let client;
let db;

const connectDB = async () => {
  if (db) return; // Already connected

  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log("Connected to MongoDB");
    }
    db = client.db(DB_NAME);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

const getCollection = (collectionName) => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db.collection(collectionName);
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// API Routes
app.post('/api/users', async (req, res) => {
  try {
    await connectDB();
    const user = req.body;
    const collection = getCollection('users');
    const existingUser = await collection.findOne({ phone: user.phone });
    if (existingUser) {
      return res.status(400).send("User with this phone already exists");
    }
    await collection.insertOne(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    await connectDB();
    const { phone } = req.query;
    const collection = getCollection('users');
    const user = await collection.findOne({ phone });
    if (!user) {
      return res.status(404).json(null);
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const user = req.body;
    const collection = getCollection('users');
    const result = await collection.updateOne({ id }, { $set: user });
    if (result.matchedCount === 0) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/crops', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.query;
    const collection = getCollection('crops');
    const crops = await collection.find({ userId }).toArray();
    res.json(crops);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/crops', async (req, res) => {
  try {
    await connectDB();
    const crop = req.body;
    const collection = getCollection('crops');
    await collection.insertOne(crop);
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/api/crops/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const collection = getCollection('crops');
    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).send('Crop not found');
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/scans', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.query;
    const collection = getCollection('scans');
    const scans = await collection.find({ userId }).sort({ timestamp: -1 }).toArray();
    res.json(scans);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/scans', async (req, res) => {
  try {
    await connectDB();
    const scan = req.body;
    const collection = getCollection('scans');
    await collection.insertOne(scan);
    res.status(201).json(scan);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/land-reports', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.query;
    const collection = getCollection('land_reports');
    const reports = await collection.find({ userId }).sort({ timestamp: -1 }).toArray();
    res.json(reports);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/land-reports', async (req, res) => {
  try {
    await connectDB();
    const report = req.body;
    const collection = getCollection('land_reports');
    await collection.insertOne(report);
    res.status(201).json(report);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
