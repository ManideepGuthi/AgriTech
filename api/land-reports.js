import { Router } from 'express';

const router = Router();

export default (getCollection) => {
  // GET /api/land-reports?userId=...
  router.get('/', async (req, res) => {
    try {
      const { userId } = req.query;
      const userIdNum = parseInt(userId);
      const collection = getCollection('land_reports');
      const reports = await collection.find({ userId: userIdNum }).toArray();
      res.json(reports);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // POST /api/land-reports
  router.post('/', async (req, res) => {
    try {
      const report = req.body;
      const collection = getCollection('land_reports');
      const result = await collection.insertOne(report);
      report.id = result.insertedId;
      res.status(201).json(report);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  return router;
};
