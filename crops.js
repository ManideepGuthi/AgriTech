import { Router } from 'express';

const router = Router();

export default (getCollection) => {
  // GET /api/crops
  router.get('/', async (req, res) => {
    try {
      const { userId } = req.query;
      const collection = getCollection('crops');
      const crops = await collection.find({ userId }).toArray();
      res.json(crops);
    } catch (error) {
      console.error("Error in /api/crops GET:", error);
      res.status(500).send(error.message);
    }
  });

  // POST /api/crops
  router.post('/', async (req, res) => {
    try {
      const crop = req.body;
      const collection = getCollection('crops');
      await collection.insertOne(crop);
      res.status(201).json(crop);
    } catch (error) {
      console.error("Error in /api/crops POST:", error);
      res.status(500).send(error.message);
    }
  });

  // DELETE /api/crops/:id
  router.delete('/:id', async (req, res) => {
    // This route has a potential issue. The ID in the URL might not match the document's `_id` field.
    // This implementation is kept as-is to match the original, but it's worth reviewing.
    res.status(501).send("DELETE /api/crops/:id not fully implemented");
  });

  return router;
};