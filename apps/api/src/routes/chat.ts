import { Router } from 'express';
import { db } from '../services/database';
import prisma from '../services/database';

const router = Router();

// Enhanced Vanna AI simulation using real database queries
const simulateVannaResponse = async (query: string) => {
  const lowerQuery = query.toLowerCase();

  try {
    // Total spend queries
    if (lowerQuery.includes('total spend') || lowerQuery.includes('total cost')) {
      const result = await prisma.summary.aggregate({
        _sum: { invoiceTotal: true }
      });
      const totalSpend = result._sum.invoiceTotal || 0;
      
      return {
        answer: `The total spend across all invoices is €${totalSpend.toFixed(2)}`,
        sql: 'SELECT SUM(invoice_total) as total_spend FROM summary;',
        results: [{ total_spend: totalSpend }]
      };
    }

    // Invoice count queries
    if (lowerQuery.includes('how many invoices') || lowerQuery.includes('number of invoices')) {
      const count = await prisma.invoice.count();
      
      return {
        answer: `There are ${count} invoices in the system.`,
        sql: 'SELECT COUNT(*) as invoice_count FROM invoice;',
        results: [{ invoice_count: count }]
      };
    }

    // Vendor queries
    if (lowerQuery.includes('top vendor') || lowerQuery.includes('highest spend')) {
      const invoices = await prisma.invoice.findMany({
        include: {
          vendor: true,
          summary: true,
        },
        where: {
          vendorId: { not: null },
          summary: { isNot: null },
        },
      });

      const vendorTotals: Record<string, { name: string; spend: number }> = {};
      invoices.forEach(inv => {
        if (inv.vendor && inv.summary) {
          if (!vendorTotals[inv.vendor.id]) {
            vendorTotals[inv.vendor.id] = { name: inv.vendor.name, spend: 0 };
          }
          vendorTotals[inv.vendor.id].spend += inv.summary.invoiceTotal;
        }
      });

      const topVendor = Object.values(vendorTotals)
        .sort((a, b) => b.spend - a.spend)[0];

      return {
        answer: `The top vendor by spend is ${topVendor.name} with €${topVendor.spend.toFixed(2)}`,
        sql: 'SELECT v.name, SUM(s.invoice_total) as total FROM invoice i JOIN vendor v ON i.vendor_id = v.id JOIN summary s ON i.id = s.invoice_id GROUP BY v.name ORDER BY total DESC LIMIT 1;',
        results: [{ vendor_name: topVendor.name, total: topVendor.spend }]
      };
    }

    // Status queries
    if (lowerQuery.includes('pending') || lowerQuery.includes('unpaid') || lowerQuery.includes('status')) {
      const invoices = await prisma.invoice.findMany({
        include: { summary: true },
        where: { status: 'pending' }
      });

      const total = invoices.reduce((sum, inv) => sum + (inv.summary?.invoiceTotal || 0), 0);

      return {
        answer: `There are ${invoices.length} pending invoices totaling €${total.toFixed(2)}`,
        sql: "SELECT COUNT(*) as count, SUM(s.invoice_total) as total FROM invoice i JOIN summary s ON i.id = s.invoice_id WHERE i.status = 'pending';",
        results: [{ count: invoices.length, total }]
      };
    }

    // Category queries
    if (lowerQuery.includes('category') || lowerQuery.includes('categories')) {
      const categoryData = await db.getCategorySpend();

      return {
        answer: 'Here is the spend breakdown by category',
        sql: 'SELECT category, SUM(amount) FROM invoices GROUP BY category;',
        results: categoryData
      };
    }

    // Average queries
    if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
      const result = await prisma.summary.aggregate({
        _avg: { invoiceTotal: true }
      });
      const avgValue = result._avg.invoiceTotal || 0;

      return {
        answer: `The average invoice value is €${avgValue.toFixed(2)}`,
        sql: 'SELECT AVG(invoice_total) as average_value FROM summary;',
        results: [{ average_value: avgValue }]
      };
    }

    // Monthly trends
    if (lowerQuery.includes('month') || lowerQuery.includes('trend') || lowerQuery.includes('over time')) {
      const trends = await db.getMonthlyTrends();

      return {
        answer: `Here are the monthly invoice trends for the last ${trends.length} months`,
        sql: 'SELECT DATE_TRUNC(\'month\', invoice_date) as month, COUNT(*) as count, SUM(invoice_total) as spend FROM invoice JOIN summary ON invoice.id = summary.invoice_id GROUP BY month ORDER BY month;',
        results: trends
      };
    }

    // Default fallback - return recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      include: {
        vendor: true,
        summary: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const results = recentInvoices.map(inv => ({
      invoice_number: inv.invoiceNumber,
      vendor_name: inv.vendor?.name || 'Unknown',
      amount: inv.summary?.invoiceTotal || 0,
      date: inv.invoiceDate?.toISOString()
    }));

    return {
      answer: 'I analyzed your query and here are the most recent invoices from the database.',
      sql: 'SELECT invoice_number, vendor_name, amount, invoice_date FROM invoice ORDER BY created_at DESC LIMIT 5;',
      results
    };

  } catch (error) {
    console.error('Error querying database:', error);
    throw error;
  }
};

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`📝 Chat query: "${query}"`);

    // Check if Vanna API is configured
    const vannaBaseUrl = process.env.VANNA_API_BASE_URL;

    if (vannaBaseUrl && vannaBaseUrl !== 'http://localhost:8000') {
      // Try to use real Vanna AI service
      try {
        const response = await fetch(`${vannaBaseUrl}/generate-sql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: query })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Vanna AI response received`);
          return res.json(data);
        }
      } catch (vannaError) {
        console.warn('⚠️ Vanna AI unavailable, using simulated responses');
      }
    }

    // Use enhanced simulated responses with real database data
    const response = await simulateVannaResponse(query);
    console.log(`✅ Generated SQL: ${response.sql}`);

    res.json(response);
  } catch (error) {
    console.error('Error processing chat query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

export default router;

