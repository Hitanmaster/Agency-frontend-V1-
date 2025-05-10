import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();
const uri = process.env.MONGODB_URI;

router.get('/', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const collection = db.collection('agencies');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
