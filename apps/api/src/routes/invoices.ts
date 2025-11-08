import { Router } from 'express';
import { db } from '../services/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { search, sort, order = 'asc' } = req.query;
    const invoices = await db.getInvoices(
      search as string,
      sort as string,
      order as 'asc' | 'desc'
    );

    res.json({
      invoices,
      total: invoices.length,
      page: 1,
      pageSize: invoices.length
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

export default router;
