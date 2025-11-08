import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SimpleInvoice } from '../../types/invoice';

interface PaymentStatusChartProps {
  invoices: SimpleInvoice[];
}

export default function PaymentStatusChart({ invoices }: PaymentStatusChartProps) {
  // Group by status
  const statusData = invoices.reduce((acc, invoice) => {
    const status = invoice.status || 'unknown';
    if (!acc[status]) {
      acc[status] = { status, count: 0, amount: 0 };
    }
    acc[status].count += 1;
    acc[status].amount += invoice.amount;
    return acc;
  }, {} as Record<string, { status: string; count: number; amount: number }>);

  const chartData = Object.values(statusData);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Invoice Count" />
          <Bar yAxisId="right" dataKey="amount" fill="#82ca9d" name="Total Amount (€)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
