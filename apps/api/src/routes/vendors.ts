import { Router } from 'express';
import { db } from '../services/database';

const router = Router();

router.get('/top10', async (req, res) => {
  try {
    const vendors = await db.getVendorSpend();
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendor spend:', error);
    res.status(500).json({ error: 'Failed to fetch vendor spend data' });
  }
});

export default router;
