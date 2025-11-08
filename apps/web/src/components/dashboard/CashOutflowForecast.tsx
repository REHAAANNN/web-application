import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CashOutflow } from '../../types/invoice';

interface CashOutflowForecastProps {
  data: CashOutflow[];
}

export const CashOutflowForecast = ({ data }: CashOutflowForecastProps) => {
  const chartData = data as any[];
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Cash Outflow Forecast</h3>
        <p className="text-xs text-gray-500 mt-1">Expected payment obligations grouped by due date ranges.</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="period"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Amount (€)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => [
                `€ ${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
                'Amount'
              ]}
            />
            <Bar 
              dataKey="amount" 
              fill="#1e293b"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
