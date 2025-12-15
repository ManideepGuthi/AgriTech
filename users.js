import { Router } from 'express';

export default (getCollection) => {
  const router = Router();

  // POST /api/users
  router.post('/', async (req, res) => {
    try {
      const user = req.body;
      console.log(`[POST /api/users] Attempting to create user: ${user.phone}`);
      const collection = getCollection('users');
      const existingUser = await collection.findOne({ phone: user.phone });
      if (existingUser) {
        console.log(`[POST /api/users] User already exists: ${user.phone}`);
        return res.status(400).send("User with this phone already exists");
      }
      await collection.insertOne(user);
      console.log(`[POST /api/users] User created: ${user.phone}`);
      res.status(201).json(user);
    } catch (error) {
      console.error(`[POST /api/users] Error:`, error);
      res.status(500).send(error.message);
    }
  });

  // GET /api/users?phone=...
  router.get('/', async (req, res) => {
    try {
      const { phone } = req.query;
      console.log(`[GET /api/users] Fetching user: ${phone}`);
      const collection = getCollection('users');
      const user = await collection.findOne({ phone });
      
      if (!user) {
         console.log(`[GET /api/users] User not found: ${phone}`);
         // Return null user instead of 404 to match frontend expectation (or 404 if preferred, but current frontend handles null)
         // Actually current frontend expects { user: ... }
         return res.status(200).json({ user: null });
      }

      console.log(`[GET /api/users] User found: ${phone}`);
      res.status(200).json({ user });
    } catch (error) {
      console.error(`[GET /api/users] Error:`, error);
      res.status(500).send(error.message);
    }
  });

  // PUT /api/users/:id
  router.put('/:id', async (req, res) => {
    // ... implementation ...
    res.status(501).send("PUT /api/users/:id not fully implemented");
  });

  return router;
};