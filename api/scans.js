import { Router } from 'express';

const router = Router();

export default (getCollection) => {
  // GET /api/scans?userId=...
  router.get('/', async (req, res) => {
    try {
      const { userId } = req.query;
      // Note: userId is stored as string in the frontend, so we query as string.
      // If your DB uses numbers, you might need to convert.
      const collection = getCollection('scans');
      const scans = await collection.find({ userId: userId }).toArray();
      res.json(scans);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // POST /api/scans
  router.post('/', async (req, res) => {
    try {
      const scan = req.body;
      const collection = getCollection('scans');
      const result = await collection.insertOne(scan);
      // Ensure we return the object with the new ID
      scan.id = result.insertedId; 
      res.status(201).json(scan);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  return router;
};
