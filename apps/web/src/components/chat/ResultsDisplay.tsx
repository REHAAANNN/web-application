import { Table } from 'lucide-react';

interface ResultsDisplayProps {
  results: any[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        No results found
      </div>
    );
  }

  const columns = Object.keys(results[0]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
        <Table className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          Results ({results.length} {results.length === 1 ? 'row' : 'rows'})
        </span>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  {column.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {formatValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function formatValue(value: any): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') {
    // Format currency if it looks like a price
    if (value > 10 && value < 1000000) {
      return `€ ${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString();
  }
  if (typeof value === 'boolean') return value ? '✓' : '✗';
  return String(value);
}
