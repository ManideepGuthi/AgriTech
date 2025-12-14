import { Router } from 'express';

const router = Router();

export default (getCollection) => {
  // POST /api/users
  router.post('/', async (req, res) => {
    try {
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

  // GET /api/users?phone=...
  router.get('/', async (req, res) => {
    try {
      const { phone } = req.query;
      const collection = getCollection('users');
      const user = await collection.findOne({ phone });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // PUT /api/users/:id
  router.put('/:id', async (req, res) => {
    // This route has a potential issue. The user ID is in the URL, but the query to find the user
    // in the database is likely based on a different field (e.g., `_id` or `phone`).
    // This implementation is kept as-is to match the original, but it's worth reviewing.
    res.status(501).send("PUT /api/users/:id not fully implemented");
  });

  return router;
};