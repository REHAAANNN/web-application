import { useEffect, useState } from 'react';
import { FileText, TrendingUp, Upload, DollarSign } from 'lucide-react';
import { OverviewCard } from './OverviewCard';
import { InvoiceVolumeTrend } from './InvoiceVolumeTrend';
import { VendorSpendChart } from './VendorSpendChart';
import { CategorySpendChart } from './CategorySpendChart';
import { CashOutflowForecast } from './CashOutflowForecast';
import { InvoicesTable } from './InvoicesTable';
import { InvoicesByVendor } from './InvoicesByVendor';
import RoleBasedView from './RoleBasedView';
import PaymentStatusChart from './PaymentStatusChart';
import MonthlyComparisonChart from './MonthlyComparisonChart';
import ChatHistory from '../chat/ChatHistory';
import ExportButtons from '../ExportButtons';
import { apiService } from '../../services/apiService';
import type { SimpleInvoice, DashboardStats, VendorSpend, CategorySpend, MonthlyTrend, CashOutflow } from '../../types/invoice';

export const Dashboard = () => {
  const [invoices, setInvoices] = useState<SimpleInvoice[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vendorSpend, setVendorSpend] = useState<VendorSpend[]>([]);
  const [categorySpend, setCategorySpend] = useState<CategorySpend[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [cashOutflow, setCashOutflow] = useState<CashOutflow[]>([]);
  const [loading, setLoading] = useState(true);

  // FORCE RELOAD FLAG - v2.0
  console.log('🚀 Dashboard v2.0 loaded with new features!', new Date().toISOString());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load all data from PostgreSQL API
      const [invoicesData, statsData, vendorData, categoryData, trendData, cashflowData] = await Promise.all([
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

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Main Content */}
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
            change={stats?.documentsUploadedChange || -8}
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

        {/* Charts Row 2 - THREE COMPONENTS IN ONE ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <CategorySpendChart data={categorySpend} />
          <CashOutflowForecast data={cashOutflow} />
          <InvoicesByVendor invoices={invoices} />
        </div>

        {/* Export Buttons */}
        <div className="mb-6">
          <ExportButtons data={invoices} filename="invoices" />
        </div>

        {/* New Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RoleBasedView invoices={invoices} />
          <ChatHistory />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PaymentStatusChart invoices={invoices} />
          <MonthlyComparisonChart invoices={invoices} />
        </div>

        {/* Recent Invoices Table - Full width */}
        <InvoicesTable invoices={invoices} />
      </main>
    </div>
  );
};
