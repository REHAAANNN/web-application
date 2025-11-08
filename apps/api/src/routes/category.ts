import { Router } from 'express';
import { db } from '../services/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await db.getCategorySpend();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching category spend:', error);
    res.status(500).json({ error: 'Failed to fetch category spend data' });
  }
});

export default router;
