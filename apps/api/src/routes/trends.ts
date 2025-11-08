import { Router } from 'express';
import { db } from '../services/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const trends = await db.getMonthlyTrends();
    res.json(trends);
  } catch (error) {
    console.error('Error fetching invoice trends:', error);
    res.status(500).json({ error: 'Failed to fetch invoice trends' });
  }
});

export default router;
