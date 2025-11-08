import type { SimpleInvoice, DashboardStats, VendorSpend, CategorySpend, MonthlyTrend, CashOutflow } from '../types/invoice';
import { format, parseISO } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiService = {
  async getInvoices(): Promise<SimpleInvoice[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      const data = await response.json();
      return data.invoices || data;
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      throw error;
    }
  },

  async getStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      const data = await response.json();
      return {
        totalSpend: data.totalSpend,
        totalSpendChange: data.ytdChange.totalSpend,
        invoicesProcessed: data.invoicesProcessed,
        invoicesProcessedChange: data.ytdChange.invoicesProcessed,
        documentsUploaded: data.documentsUploaded,
        documentsUploadedChange: data.ytdChange.documentsUploaded,
        averageInvoiceValue: data.averageInvoiceValue,
        averageInvoiceValueChange: data.ytdChange.averageInvoiceValue
      };
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw error;
    }
  },

  async getVendorSpend(): Promise<VendorSpend[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/top10`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      const data = await response.json();
      
      // Transform to include percentage
      const total = data.reduce((sum: number, v: any) => sum + v.spend, 0);
      return data.map((vendor: any) => ({
        vendor: vendor.name,
        spend: vendor.spend,
        percentage: (vendor.spend / total) * 100
      }));
    } catch (error) {
      console.error('Failed to fetch vendor spend:', error);
      throw error;
    }
  },

  async getCategorySpend(): Promise<CategorySpend[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/category-spend`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      const data = await response.json();
      
      // Add colors
      const colors = ['#2563eb', '#ea580c', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];
      return data.map((cat: any, index: number) => ({
        name: cat.name,
        value: cat.value,
        fill: colors[index % colors.length]
      }));
    } catch (error) {
      console.error('Failed to fetch category spend:', error);
      throw error;
    }
  },

  async getMonthlyTrend(): Promise<MonthlyTrend[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoice-trends`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      const data = await response.json();
      
      // Transform month format from YYYY-MM to MMM
      return data.map((item: any) => {
        const date = parseISO(item.month + '-01');
        return {
          month: format(date, 'MMM'),
          invoiceCount: item.count,
          totalSpend: item.spend
        };
      });
    } catch (error) {
      console.error('Failed to fetch invoice trends:', error);
      throw error;
    }
  },

  async getCashOutflow(): Promise<CashOutflow[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cash-outflow`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      const data = await response.json();
      
      // Transform date format to period labels
      return data.map((item: any) => ({
        period: item.date,
        amount: item.amount
      }));
    } catch (error) {
      console.error('Failed to fetch cash outflow:', error);
      throw error;
    }
  }
};
