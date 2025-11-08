import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MonthlyTrend } from '../../types/invoice';

interface InvoiceVolumeTrendProps {
  data: MonthlyTrend[];
}

export const InvoiceVolumeTrend = ({ data }: InvoiceVolumeTrendProps) => {
  // Get current month data for display
  const currentMonth = data[data.length - 1] || { month: 'Oct', invoiceCount: 0, totalSpend: 0 };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Invoice Volume + Value Trend</h3>
        <p className="text-xs text-gray-500 mt-1">Invoice count and total spend over 12 months.</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="text-xs text-gray-600 mb-2">{currentMonth.month} 2025</div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-gray-500">Invoice count:</div>
            <div className="text-lg font-semibold text-gray-900">{currentMonth.invoiceCount}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Total Spend:</div>
            <div className="text-lg font-semibold text-blue-600">
              € {currentMonth.totalSpend.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'totalSpend') {
                  return ['€ ' + value.toLocaleString('de-DE', { minimumFractionDigits: 2 }), 'Total Spend'];
                }
                return [value, 'Invoice Count'];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="invoiceCount" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Invoice Count"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="totalSpend" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Spend (€)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
