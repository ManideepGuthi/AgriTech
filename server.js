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
  land_reports: [],
  posts: [
    {
      id: '1',
      author: 'Ramesh Kumar',
      userId: 'user1',
      content: 'Successfully harvested my Ragi crop today! The yield is better than last year thanks to the soil test recommendations.',
      likes: 24,
      comments: 5,
      timestamp: Date.now() - 7200000, // 2 hours ago
      likedBy: []
    },
    {
      id: '2',
      author: 'Suresh Reddy',
      userId: 'user2',
      content: 'Does anyone know the current market price for Foxtail Millet in Adoni market?',
      likes: 12,
      comments: 8,
      timestamp: Date.now() - 18000000, // 5 hours ago
      likedBy: []
    },
    {
      id: '3',
      author: 'Lakshmi Devi',
      userId: 'user3',
      content: 'Found a new organic fertilizer for Pearl Millet. Results are promising!',
      likes: 45,
      comments: 12,
      timestamp: Date.now() - 86400000, // 1 day ago
      likedBy: []
    }
  ]
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

<<<<<<< HEAD
=======
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

app.get('/api/posts', async (req, res) => {
  try {
    await connectDB();
    const collection = getCollection('posts');
    const posts = await collection.find({}).sort({ timestamp: -1 }).toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    await connectDB();
    const post = req.body;
    // Ensure default fields
    post.timestamp = post.timestamp || Date.now();
    post.likes = 0;
    post.comments = 0;
    post.likedBy = [];
    
    const collection = getCollection('posts');
    await collection.insertOne(post);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) return res.status(400).send("User ID required");

    const collection = getCollection('posts');
    const post = await collection.findOne({ id });
    
    if (!post) return res.status(404).send("Post not found");
    
    const likedIndex = post.likedBy ? post.likedBy.indexOf(userId) : -1;
    let updateOp;
    
    if (likedIndex === -1) {
      // Like
      updateOp = { 
        $inc: { likes: 1 },
        $push: { likedBy: userId }
      };
    } else {
      // Unlike
      updateOp = { 
        $inc: { likes: -1 },
        $pull: { likedBy: userId }
      };
    }
    
    // For MOCK_DB, we need to handle $push and $pull manually if not using MongoDB
    if (!db) {
       // Manual update for mock
       const mockPost = post;
       if (!mockPost.likedBy) mockPost.likedBy = [];
       
       if (likedIndex === -1) {
         mockPost.likes = (mockPost.likes || 0) + 1;
         mockPost.likedBy.push(userId);
       } else {
         mockPost.likes = Math.max(0, (mockPost.likes || 0) - 1);
         mockPost.likedBy.splice(likedIndex, 1);
       }
       // Update in mock array is already done by reference, but let's be safe
       await collection.updateOne({ id }, { $set: { likes: mockPost.likes, likedBy: mockPost.likedBy } });
       res.json({ success: true, likes: mockPost.likes, likedBy: mockPost.likedBy });
    } else {
       await collection.updateOne({ id }, updateOp);
       const updatedPost = await collection.findOne({ id });
       res.json({ success: true, likes: updatedPost.likes, likedBy: updatedPost.likedBy });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { content, userId } = req.body;
    
    if (!content) return res.status(400).send("Content required");

    const collection = getCollection('posts');
    const post = await collection.findOne({ id });
    
    if (!post) return res.status(404).send("Post not found");
    if (post.userId !== userId) return res.status(403).send("Unauthorized");
    
    await collection.updateOne({ id }, { $set: { content } });
    res.json({ ...post, content });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { userId } = req.query; // Pass userId as query param for delete
    
    const collection = getCollection('posts');
    const post = await collection.findOne({ id });
    
    if (!post) return res.status(404).send("Post not found");
    if (post.userId !== userId) return res.status(403).send("Unauthorized");
    
    await collection.deleteOne({ id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/market', async (req, res) => {
  try {
    await connectDB();
    const collection = getCollection('market');
    const items = await collection.find({}).sort({ timestamp: -1 }).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/market', async (req, res) => {
  try {
    await connectDB();
    const item = req.body;
    if (!item.sellerId || !item.name || !item.price) {
      return res.status(400).send("Missing required fields");
    }
    
    const collection = getCollection('market');
    await collection.insertOne(item);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/land_reports', async (req, res) => {
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

app.post('/api/land_reports', async (req, res) => {
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

>>>>>>> d4575e9 (Feature Update)
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
