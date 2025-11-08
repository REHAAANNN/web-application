import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SimpleInvoice } from '../../types/invoice';

interface MonthlyComparisonChartProps {
  invoices: SimpleInvoice[];
}

export default function MonthlyComparisonChart({ invoices }: MonthlyComparisonChartProps) {
  // Group by month
  const monthlyData = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.invoiceDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, count: 0, total: 0, avgAmount: 0 };
    }
    acc[monthKey].count += 1;
    acc[monthKey].total += invoice.amount;
    return acc;
  }, {} as Record<string, { month: string; count: number; total: number; avgAmount: number }>);

  // Calculate averages
  const chartData = Object.values(monthlyData)
    .map(data => ({
      ...data,
      avgAmount: data.total / data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8884d8" name="Invoice Count" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="total" stroke="#82ca9d" name="Total Amount (€)" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="avgAmount" stroke="#ffc658" name="Avg Amount (€)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
