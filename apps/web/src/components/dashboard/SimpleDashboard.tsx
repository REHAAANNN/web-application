import { useEffect, useState } from 'react';
import { FileText, TrendingUp, Upload, DollarSign } from 'lucide-react';
import { OverviewCard } from './OverviewCard';
import { InvoiceVolumeTrend } from './InvoiceVolumeTrend';
import { VendorSpendChart } from './VendorSpendChart';
import { CategorySpendChart } from './CategorySpendChart';
import { CashOutflowForecast } from './CashOutflowForecast';
import { apiService } from '../../services/apiService';
import type { SimpleInvoice, DashboardStats, VendorSpend, CategorySpend, MonthlyTrend, CashOutflow } from '../../types/invoice';
import { format, parseISO } from 'date-fns';

interface SimpleInvoicesTableProps {
  invoices: SimpleInvoice[];
}

const SimpleInvoicesTable = ({ invoices }: SimpleInvoicesTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      invoice.vendorName.toLowerCase().includes(searchLower) ||
      invoice.invoiceNumber.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.slice(0, 50).map((invoice) => {
                const date = parseISO(invoice.invoiceDate || invoice.createdAt);
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.vendorName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {format(date, 'dd.MM.yyyy')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      € {invoice.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SimpleDashboard = () => {
  const [invoices, setInvoices] = useState<SimpleInvoice[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vendorSpend, setVendorSpend] = useState<VendorSpend[]>([]);
  const [categorySpend, setCategorySpend] = useState<CategorySpend[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [cashOutflow, setCashOutflow] = useState<CashOutflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        invoicesData,
        statsData,
        vendorData,
        categoryData,
        trendData,
        cashflowData
      ] = await Promise.all([
        apiService.getInvoices(),
        apiService.getStats(),
        apiService.getVendorSpend(),
        apiService.getCategorySpend(),
        apiService.getMonthlyTrend(),
        apiService.getCashOutflow()
      ]);

      setInvoices(invoicesData);
      setStats(statsData);
      setVendorSpend(vendorData);
      setCategorySpend(categoryData);
      setMonthlyTrend(trendData);
      setCashOutflow(cashflowData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please make sure the API server is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <FileText className="w-4 h-4" />
          <span>Dashboard</span>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <OverviewCard
            title="Total Spend"
            value={`€ ${(stats?.totalSpend || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change={stats?.totalSpendChange || 0}
            period="(YTD)"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <OverviewCard
            title="Total Invoices Processed"
            value={String(stats?.invoicesProcessed || 0)}
            change={stats?.invoicesProcessedChange || 0}
          />
          <OverviewCard
            title="Documents Uploaded"
            value={String(stats?.documentsUploaded || 0)}
            change={stats?.documentsUploadedChange || 0}
            period="This Month"
            icon={<Upload className="w-5 h-5" />}
          />
          <OverviewCard
            title="Average Invoice Value"
            value={`€ ${(stats?.averageInvoiceValue || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change={stats?.averageInvoiceValueChange || 0}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InvoiceVolumeTrend data={monthlyTrend} />
          <VendorSpendChart data={vendorSpend} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CategorySpendChart data={categorySpend} />
          <CashOutflowForecast data={cashOutflow} />
        </div>

        {/* Invoices Table */}
        <SimpleInvoicesTable invoices={invoices} />
      </main>
    </div>
  );
};
