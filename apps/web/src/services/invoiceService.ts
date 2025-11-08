import type { Invoice, DashboardStats, VendorSpend, CategorySpend, MonthlyTrend, CashOutflow } from '../types/invoice';
import { format, subMonths, parseISO } from 'date-fns';
import { mockInvoices } from './mockData';

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    // Always use mock data for now since API returns different format
    console.log('Using mock invoice data');
    return mockInvoices as Invoice[];
  },

  async getStats(): Promise<DashboardStats | null> {
    // Return null to use calculated stats
    return null;
  },

  calculateStats(invoices: Invoice[], previousInvoices: Invoice[]): DashboardStats {
    const currentYear = new Date().getFullYear();
    const ytdInvoices = invoices.filter(inv => {
      const dateStr = inv.createdAt?.$date;
      if (!dateStr) return false;
      const year = new Date(dateStr).getFullYear();
      return year === currentYear;
    });

    const totalSpend = ytdInvoices.reduce((sum, inv) => {
      const total = inv.extractedData?.llmData?.summary?.value?.invoiceTotal?.value || 0;
      return sum + Math.abs(total);
    }, 0);

    const prevTotalSpend = previousInvoices.reduce((sum, inv) => {
      const total = inv.extractedData?.llmData?.summary?.value?.invoiceTotal?.value || 0;
      return sum + Math.abs(total);
    }, 0);

    const invoicesProcessed = invoices.length;
    const documentsUploaded = invoices.filter(inv => inv.status === 'processed').length;
    const averageInvoiceValue = totalSpend / (ytdInvoices.length || 1);

    const prevAvg = prevTotalSpend / (previousInvoices.length || 1);

    return {
      totalSpend,
      totalSpendChange: prevTotalSpend ? ((totalSpend - prevTotalSpend) / prevTotalSpend) * 100 : 0,
      invoicesProcessed,
      invoicesProcessedChange: previousInvoices.length ? ((invoicesProcessed - previousInvoices.length) / previousInvoices.length) * 100 : 0,
      documentsUploaded,
      documentsUploadedChange: 0, // Simplified for demo
      averageInvoiceValue,
      averageInvoiceValueChange: prevAvg ? ((averageInvoiceValue - prevAvg) / prevAvg) * 100 : 0,
    };
  },

  getVendorSpend(invoices: Invoice[]): VendorSpend[] {
    const vendorMap = new Map<string, number>();
    
    invoices.forEach(inv => {
      const vendorName = inv.extractedData?.llmData?.vendor?.value?.vendorName?.value || 'Unknown';
      const amount = Math.abs(inv.extractedData?.llmData?.summary?.value?.invoiceTotal?.value || 0);
      vendorMap.set(vendorName, (vendorMap.get(vendorName) || 0) + amount);
    });

    const totalSpend = Array.from(vendorMap.values()).reduce((sum, val) => sum + val, 0);
    
    return Array.from(vendorMap.entries())
      .map(([vendor, spend]) => ({
        vendor,
        spend,
        percentage: (spend / totalSpend) * 100
      }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);
  },

  getCategorySpend(invoices: Invoice[]): CategorySpend[] {
    const categories = [
      { name: 'Operations', value: 0, fill: '#2563eb' },
      { name: 'Marketing', value: 0, fill: '#ea580c' },
      { name: 'Facilities', value: 0, fill: '#f59e0b' },
    ];

    invoices.forEach(inv => {
      const description = inv.extractedData?.llmData?.lineItems?.value?.items?.value?.[0]?.description?.value || '';
      const amount = Math.abs(inv.extractedData?.llmData?.summary?.value?.invoiceTotal?.value || 0);
      
      if (description.toLowerCase().includes('market') || description.toLowerCase().includes('service')) {
        categories[1].value += amount;
      } else if (description.toLowerCase().includes('facilit') || description.toLowerCase().includes('heating')) {
        categories[2].value += amount;
      } else {
        categories[0].value += amount;
      }
    });

    return categories.filter(cat => cat.value > 0);
  },

  getMonthlyTrend(invoices: Invoice[]): MonthlyTrend[] {
    const monthMap = new Map<string, { count: number; spend: number }>();
    
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const key = format(date, 'MMM');
      monthMap.set(key, { count: 0, spend: 0 });
    }

    invoices.forEach(inv => {
      try {
        const dateStr = inv.createdAt?.$date;
        if (!dateStr) return;
        
        const date = parseISO(dateStr);
        const monthKey = format(date, 'MMM');
        const amount = Math.abs(inv.extractedData?.llmData?.summary?.value?.invoiceTotal?.value || 0);
        
        if (monthMap.has(monthKey)) {
          const current = monthMap.get(monthKey)!;
          monthMap.set(monthKey, {
            count: current.count + 1,
            spend: current.spend + amount
          });
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    });

    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      invoiceCount: data.count,
      totalSpend: data.spend
    }));
  },

  getCashOutflowForecast(invoices: Invoice[]): CashOutflow[] {
    const periods = ['0-7 days', '8-30 days', '31-60 days', '60+ days'];
    const now = new Date();
    
    const forecast: CashOutflow[] = periods.map(period => ({ period, amount: 0 }));

    invoices.forEach(inv => {
      const dueDateStr = inv.extractedData?.llmData?.payment?.value?.dueDate?.value;
      if (dueDateStr) {
        try {
          const due = parseISO(dueDateStr);
          const daysUntilDue = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const amount = Math.abs(inv.extractedData?.llmData?.summary?.value?.invoiceTotal?.value || 0);
          
          if (daysUntilDue <= 7) forecast[0].amount += amount;
          else if (daysUntilDue <= 30) forecast[1].amount += amount;
          else if (daysUntilDue <= 60) forecast[2].amount += amount;
          else forecast[3].amount += amount;
        } catch (error) {
          // Skip invalid dates
        }
      }
    });

    return forecast;
  }
};
