import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { VendorSpend } from '../../types/invoice';

interface VendorSpendChartProps {
  data: VendorSpend[];
}

const COLORS = ['#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc', '#fafaf9', '#f5f5f4'];

export const VendorSpendChart = ({ data }: VendorSpendChartProps) => {
  // Find Global Supply for highlighting
  const globalSupplyData = data.find(v => v.vendor === 'Global Supply') || data[0];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Spend by Vendor (Top 10)</h3>
        <p className="text-xs text-gray-500 mt-1">Vendor spend with cumulative percentage distribution.</p>
      </div>

      {globalSupplyData && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-900 font-medium mb-2">{globalSupplyData.vendor}</div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-gray-500">Vendor Spend:</div>
              <div className="text-lg font-semibold text-purple-600">
                € {globalSupplyData.spend.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {globalSupplyData.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis 
              type="number"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Spend (€)', position: 'bottom', fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              type="category"
              dataKey="vendor"
              tick={{ fill: '#374151', fontSize: 11 }}
              axisLine={{ stroke: '#e5e7eb' }}
              width={110}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number, _name: string, props: any) => {
                return [
                  `€ ${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} (${props.payload.percentage.toFixed(1)}%)`,
                  'Spend'
                ];
              }}
            />
            <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
