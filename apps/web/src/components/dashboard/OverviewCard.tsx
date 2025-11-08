import { TrendingUp, TrendingDown } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string;
  change: number;
  period?: string;
  icon?: React.ReactNode;
}

export const OverviewCard = ({ title, value, change, period = 'from last month', icon }: OverviewCardProps) => {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      {period && (
        <div className="text-xs text-gray-400 mb-2">{period}</div>
      )}
      
      <div className="flex items-baseline justify-between mt-2">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendIcon className="w-4 h-4" />
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-1">{period}</div>
    </div>
  );
};
