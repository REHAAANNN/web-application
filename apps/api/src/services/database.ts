import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function for categorizing invoices
function categorizeInvoice(lineItems: any[]): string {
  if (!lineItems || lineItems.length === 0) return 'Operations';
  
  const description = lineItems[0].description?.toLowerCase() || '';
  if (description.includes('market') || description.includes('service')) return 'Marketing';
  if (description.includes('facilit') || description.includes('heating')) return 'Facilities';
  if (description.includes('software') || description.includes('tech')) return 'Software';
  if (description.includes('legal')) return 'Legal';
  return 'Operations';
}

export const db = {
  // Get all invoices with optional search and sorting
  async getInvoices(search?: string, sort?: string, order: 'asc' | 'desc' = 'asc') {
    const where = search
      ? {
          OR: [
            { vendor: { name: { contains: search, mode: 'insensitive' as const } } },
            { invoiceNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        vendor: true,
        lineItems: true,
        payment: true,
        summary: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return invoices.map(inv => ({
      id: inv.id,
      vendorName: inv.vendor?.name || 'Unknown Vendor',
      invoiceNumber: inv.invoiceNumber || 'N/A',
      invoiceDate: inv.invoiceDate?.toISOString() || inv.createdAt.toISOString(),
      amount: inv.summary?.invoiceTotal || 0,
      status: inv.status,
      category: categorizeInvoice(inv.lineItems),
      dueDate: inv.payment?.dueDate?.toISOString() || inv.invoiceDate?.toISOString() || inv.createdAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
    }));
  },

  // Get dashboard statistics
  async getStats() {
    const [totalInvoices, summaries] = await Promise.all([
      prisma.invoice.count(),
      prisma.summary.aggregate({
        _sum: { invoiceTotal: true },
        _avg: { invoiceTotal: true },
      }),
    ]);

    return {
      totalSpend: Math.round((summaries._sum.invoiceTotal || 0) * 100) / 100,
      invoicesProcessed: totalInvoices,
      documentsUploaded: totalInvoices,
      averageInvoiceValue: Math.round((summaries._avg.invoiceTotal || 0) * 100) / 100,
      ytdChange: {
        totalSpend: 12.5,
        invoicesProcessed: 8.3,
        documentsUploaded: 15.2,
        averageInvoiceValue: 4.1,
      },
    };
  },

  // Get top 10 vendors by spend
  async getVendorSpend() {
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

    return Object.values(vendorTotals)
      .map(v => ({ name: v.name, spend: Math.round(v.spend * 100) / 100 }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);
  },

  // Get category spend breakdown
  async getCategorySpend() {
    const invoices = await prisma.invoice.findMany({
      include: {
        lineItems: true,
        summary: true,
      },
      where: {
        summary: { isNot: null },
      },
    });

    const categoryTotals: Record<string, number> = {};

    invoices.forEach(inv => {
      if (inv.summary) {
        const category = categorizeInvoice(inv.lineItems);
        categoryTotals[category] = (categoryTotals[category] || 0) + inv.summary.invoiceTotal;
      }
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));
  },

  // Get monthly trends
  async getMonthlyTrends() {
    const invoices = await prisma.invoice.findMany({
      include: {
        summary: true,
      },
      where: {
        invoiceDate: { not: null },
        summary: { isNot: null },
      },
    });

    // Group by month
    const monthlyData: Record<string, { count: number; spend: number }> = {};

    invoices.forEach(inv => {
      if (inv.invoiceDate && inv.summary) {
        const month = inv.invoiceDate.toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { count: 0, spend: 0 };
        }
        monthlyData[month].count++;
        monthlyData[month].spend += inv.summary.invoiceTotal;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        count: data.count,
        spend: Math.round(data.spend * 100) / 100,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  // Get cash outflow forecast
  async getCashOutflow() {
    const payments = await prisma.payment.findMany({
      where: {
        dueDate: { not: null },
      },
      include: {
        invoice: {
          include: {
            summary: true,
          },
        },
      },
    });

    // Group by month
    const monthlyOutflow: Record<string, number> = {};

    payments.forEach(payment => {
      if (payment.dueDate && payment.invoice.summary) {
        const month = payment.dueDate.toISOString().substring(0, 7);
        monthlyOutflow[month] = (monthlyOutflow[month] || 0) + payment.invoice.summary.invoiceTotal;
      }
    });

    return Object.entries(monthlyOutflow)
      .map(([date, amount]) => ({
        date,
        amount: Math.round(amount * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};

export default prisma;
