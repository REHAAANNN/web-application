import * as fs from 'fs';
import * as path from 'path';

// Load real data from JSON file
let realInvoices: any[] = [];
try {
  const dataPath = path.join(process.cwd(), '../../Data/Analytics_Test_Data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  realInvoices = JSON.parse(rawData);
  console.log(`✅ Loaded ${realInvoices.length} invoices from Analytics_Test_Data.json`);
} catch (error) {
  console.warn('⚠️ Could not load Analytics_Test_Data.json, using mock data');
}

// Simplified invoice format for API responses
interface SimpleInvoice {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  status: string;
  category: string;
  dueDate: string;
  createdAt: string;
}

// Transform real data to simplified format
const transformInvoice = (invoice: any): SimpleInvoice => {
  const vendorName = invoice.extractedData?.llmData?.vendor?.value?.vendorName?.value || 'Unknown Vendor';
  const invoiceNumber = invoice.extractedData?.llmData?.invoice?.value?.invoiceId?.value || 'N/A';
  const invoiceDate = invoice.extractedData?.llmData?.invoice?.value?.invoiceDate?.value || invoice.createdAt?.$date || '';
  const amount = Math.abs(invoice.extractedData?.llmData?.summary?.value?.invoiceTotal?.value || 0);
  const dueDate = invoice.extractedData?.llmData?.payment?.value?.dueDate?.value || invoiceDate;
  const createdAt = invoice.createdAt?.$date || new Date().toISOString();
  
  // Determine category based on description or vendor
  const description = invoice.extractedData?.llmData?.lineItems?.value?.items?.value?.[0]?.description?.value || '';
  let category = 'Operations';
  if (description.toLowerCase().includes('market') || description.toLowerCase().includes('service')) {
    category = 'Marketing';
  } else if (description.toLowerCase().includes('facilit') || description.toLowerCase().includes('heating')) {
    category = 'Facilities';
  } else if (description.toLowerCase().includes('software') || description.toLowerCase().includes('tech')) {
    category = 'Software';
  } else if (description.toLowerCase().includes('legal')) {
    category = 'Legal';
  }
  
  return {
    id: invoice._id,
    vendorName,
    invoiceNumber,
    invoiceDate,
    amount,
    status: invoice.status || 'processed',
    category,
    dueDate,
    createdAt
  };
};

// Use real data if available, otherwise fallback to mock
export const mockInvoices = realInvoices.length > 0 
  ? realInvoices.map(transformInvoice)
  : [
  {
    id: 'INV-001',
    vendorName: 'Phunk GmbH',
    invoiceNumber: 'PHK-2025-001',
    invoiceDate: '2025-02-15',
    amount: 2450.00,
    status: 'paid',
    category: 'Services',
    dueDate: '2025-03-15',
    createdAt: '2025-02-15T10:30:00Z'
  },
  {
    id: 'INV-002',
    vendorName: 'Global Supply Co.',
    invoiceNumber: 'GS-2025-042',
    invoiceDate: '2025-03-10',
    amount: 8679.25,
    status: 'pending',
    category: 'Materials',
    dueDate: '2025-04-10',
    createdAt: '2025-03-10T14:20:00Z'
  },
  {
    id: 'INV-003',
    vendorName: 'Test Solutions Ltd',
    invoiceNumber: 'TSL-2025-018',
    invoiceDate: '2025-04-05',
    amount: 1250.50,
    status: 'paid',
    category: 'Consulting',
    dueDate: '2025-05-05',
    createdAt: '2025-04-05T09:15:00Z'
  },
  {
    id: 'INV-004',
    vendorName: 'Tech Innovators Inc',
    invoiceNumber: 'TI-2025-234',
    invoiceDate: '2025-05-20',
    amount: 4500.00,
    status: 'overdue',
    category: 'Software',
    dueDate: '2025-06-20',
    createdAt: '2025-05-20T16:45:00Z'
  },
  {
    id: 'INV-005',
    vendorName: 'Office Supplies R Us',
    invoiceNumber: 'OSR-2025-891',
    invoiceDate: '2025-06-12',
    amount: 450.75,
    status: 'paid',
    category: 'Office Supplies',
    dueDate: '2025-07-12',
    createdAt: '2025-06-12T11:00:00Z'
  },
  {
    id: 'INV-006',
    vendorName: 'Phunk GmbH',
    invoiceNumber: 'PHK-2025-002',
    invoiceDate: '2025-07-08',
    amount: 3200.00,
    status: 'pending',
    category: 'Services',
    dueDate: '2025-08-08',
    createdAt: '2025-07-08T13:30:00Z'
  },
  {
    id: 'INV-007',
    vendorName: 'CloudHost Services',
    invoiceNumber: 'CHS-2025-567',
    invoiceDate: '2025-08-15',
    amount: 2890.00,
    status: 'paid',
    category: 'Infrastructure',
    dueDate: '2025-09-15',
    createdAt: '2025-08-15T10:00:00Z'
  },
  {
    id: 'INV-008',
    vendorName: 'Marketing Agency Pro',
    invoiceNumber: 'MAP-2025-123',
    invoiceDate: '2025-09-22',
    amount: 6750.00,
    status: 'pending',
    category: 'Marketing',
    dueDate: '2025-10-22',
    createdAt: '2025-09-22T15:20:00Z'
  },
  {
    id: 'INV-009',
    vendorName: 'Global Supply Co.',
    invoiceNumber: 'GS-2025-089',
    invoiceDate: '2025-10-05',
    amount: 5430.50,
    status: 'paid',
    category: 'Materials',
    dueDate: '2025-11-05',
    createdAt: '2025-10-05T09:45:00Z'
  },
  {
    id: 'INV-010',
    vendorName: 'Legal Advisors LLC',
    invoiceNumber: 'LA-2025-456',
    invoiceDate: '2025-10-28',
    amount: 7200.00,
    status: 'pending',
    category: 'Legal',
    dueDate: '2025-11-28',
    createdAt: '2025-10-28T14:00:00Z'
  }
];

export const getStats = () => {
  const totalSpend = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const invoicesProcessed = mockInvoices.length;
  const documentsUploaded = mockInvoices.length; // Simplified
  const averageInvoiceValue = totalSpend / invoicesProcessed;

  return {
    totalSpend: Math.round(totalSpend * 100) / 100,
    invoicesProcessed,
    documentsUploaded,
    averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,
    ytdChange: {
      totalSpend: 12.5,
      invoicesProcessed: 8.3,
      documentsUploaded: 15.2,
      averageInvoiceValue: 4.1
    }
  };
};

export const getVendorSpend = () => {
  const vendorTotals = mockInvoices.reduce((acc, inv) => {
    acc[inv.vendorName] = (acc[inv.vendorName] || 0) + inv.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(vendorTotals)
    .map(([name, spend]) => ({ name, spend: Math.round(spend * 100) / 100 }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 10);
};

export const getCategorySpend = () => {
  const categoryTotals = mockInvoices.reduce((acc, inv) => {
    acc[inv.category] = (acc[inv.category] || 0) + inv.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
};

export const getMonthlyTrends = () => {
  const monthlyData = mockInvoices.reduce((acc, inv) => {
    const month = inv.invoiceDate.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { count: 0, spend: 0 };
    }
    acc[month].count++;
    acc[month].spend += inv.amount;
    return acc;
  }, {} as Record<string, { count: number; spend: number }>);

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      count: data.count,
      spend: Math.round(data.spend * 100) / 100
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const getCashOutflow = () => {
  // Group by due date month
  const monthlyOutflow = mockInvoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((acc, inv) => {
      const month = inv.dueDate.substring(0, 7);
      acc[month] = (acc[month] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(monthlyOutflow)
    .map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
