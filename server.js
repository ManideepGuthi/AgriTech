import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from 'mongodb';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import chatRouter from "./api/chat.ts";
import govtSchemesRouter from "./api/govt-schemes.ts";
import landAnalysisRouter from "./api/land-analysis.ts";
import yieldEstimateRouter from "./api/yield-estimate.ts";
import analyzeImageRouter from "./api/analyze-image.ts"; // Note: tsx handles .ts imports
import usersCrudRouter from "./users.js";
import cropsCrudRouter from "./crops.js";
import landReportsCrudRouter from "./api/land-reports.js";
import scansCrudRouter from "./api/scans.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'agritech_db';

let client;
let db;

const MOCK_DB = {
  users: [],
  crops: [],
  scans: [],
  land_reports: []
};

class MockCollection {
  constructor(name) {
    this.name = name;
    this.data = MOCK_DB[name] || [];
  }

  async findOne(query) {
    return this.data.find(item => Object.keys(query).every(key => item[key] === query[key])) || null;
  }

  async insertOne(doc) {
    this.data.push(doc);
    return { insertedId: doc.id || Date.now() };
  }

  async updateOne(query, update) {
    const idx = this.data.findIndex(item => Object.keys(query).every(key => item[key] === query[key]));
    if (idx !== -1) {
      if (update.$set) {
        this.data[idx] = { ...this.data[idx], ...update.$set };
      }
      return { matchedCount: 1 };
    }
    return { matchedCount: 0 };
  }

  async deleteOne(query) {
    const idx = this.data.findIndex(item => Object.keys(query).every(key => item[key] === query[key]));
    if (idx !== -1) {
      this.data.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  find(query) {
    const filtered = this.data.filter(item => Object.keys(query).every(key => item[key] === query[key]));
    return {
      toArray: async () => filtered,
      sort: (criteria) => {
        const sorted = [...filtered].sort((a, b) => {
          const key = Object.keys(criteria)[0];
          return criteria[key] === -1 ? b[key] - a[key] : a[key] - b[key];
        });
        return {
          toArray: async () => sorted
        };
      }
    };
  }
}

const connectDB = async () => {
  if (db && client) return;

  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not defined. Switching to OFFLINE MOCK MODE.");
    return false;
  }
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000
      });
      await client.connect();
      console.log("Connected to MongoDB via Atlas");
    }
    db = client.db(DB_NAME);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    console.error("Switching to OFFLINE MOCK MODE.");
    db = null; // Ensure db is null so getCollection uses Mock
    return false;
  }
  return true;
};

const getCollection = (collectionName) => {
  if (!db) {
    console.log(`[Offline Mode] Accessing collection: ${collectionName}`);
    return new MockCollection(collectionName);
  }
  return db.collection(collectionName);
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// AI Routes
app.use('/api/chat', chatRouter);
app.use('/api/govt-schemes', govtSchemesRouter);
app.use('/api/land-analysis', landAnalysisRouter);
app.use('/api/yield-estimate', yieldEstimateRouter);
app.use('/api/analyze-image', analyzeImageRouter);

// CRUD Routes
app.use('/api/users', usersCrudRouter(getCollection));
app.use('/api/crops', cropsCrudRouter(getCollection));
app.use('/api/land-reports', landReportsCrudRouter(getCollection));
app.use('/api/scans', scansCrudRouter(getCollection));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // The connectDB call is not needed here as it's handled on startup.
    // We can directly check the status of the 'db' object.
    const dbStatus = db ? 'connected' : 'disconnected (mock mode)';
    res.json({ status: 'ok', database: dbStatus });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log("Server running on port", port);
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn("Database connection failed. Server running in OFFLINE MOCK MODE.");
  }
});
