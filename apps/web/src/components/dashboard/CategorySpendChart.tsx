import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategorySpend } from '../../types/invoice';

interface CategorySpendChartProps {
  data: CategorySpend[];
}

export const CategorySpendChart = ({ data }: CategorySpendChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data as any[];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Spend by Category</h3>
        <p className="text-xs text-gray-500 mt-1">Distribution of spending across different categories.</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => {
                const percentage = ((value / total) * 100).toFixed(1);
                return [`€ ${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} (${percentage}%)`, 'Spend'];
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value: string, entry: any) => {
                const percentage = ((entry.payload.value / total) * 100).toFixed(1);
                return `${value}: ${percentage}%`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900">
              € {item.value.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
