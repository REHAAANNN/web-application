export interface Invoice {
  _id: string;
  name: string;
  status: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  extractedData?: {
    llmData?: {
      vendor?: {
        value?: {
          vendorName?: { value: string };
        };
      };
      summary?: {
        value?: {
          invoiceTotal?: { value: number };
          subTotal?: { value: number };
          totalTax?: { value: number };
          currencySymbol?: { value: string };
        };
      };
      invoice?: {
        value?: {
          invoiceId?: { value: string };
          invoiceDate?: { value: string };
        };
      };
      lineItems?: {
        value?: {
          items?: {
            value?: Array<{
              description?: { value: string };
            }>;
          };
        };
      };
      payment?: {
        value?: {
          dueDate?: { value: string };
        };
      };
    };
  };
  analyticsId?: string;
}

// Simplified invoice format from API
export interface SimpleInvoice {
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

export interface DashboardStats {
  totalSpend: number;
  totalSpendChange: number;
  invoicesProcessed: number;
  invoicesProcessedChange: number;
  documentsUploaded: number;
  documentsUploadedChange: number;
  averageInvoiceValue: number;
  averageInvoiceValueChange: number;
}

export interface VendorSpend {
  vendor: string;
  spend: number;
  percentage: number;
}

export interface CategorySpend {
  name: string;
  value: number;
  fill: string;
}

export interface MonthlyTrend {
  month: string;
  invoiceCount: number;
  totalSpend: number;
}

export interface CashOutflow {
  period: string;
  amount: number;
}
