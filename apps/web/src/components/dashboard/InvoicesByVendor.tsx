import { useMemo } from 'react';
import type { SimpleInvoice } from '../../types/invoice';

interface InvoicesByVendorProps {
  invoices: SimpleInvoice[];
}

interface VendorAggregate {
  vendor: string;
  invoiceCount: number;
  netValue: number;
  latestDate: string;
}

export const InvoicesByVendor = ({ invoices }: InvoicesByVendorProps) => {
  const vendorAggregates = useMemo(() => {
    const vendorMap = new Map<string, VendorAggregate>();

    invoices.forEach(invoice => {
      const vendor = invoice.vendorName || 'Unknown Vendor';
      
      if (!vendorMap.has(vendor)) {
        vendorMap.set(vendor, {
          vendor,
          invoiceCount: 0,
          netValue: 0,
          latestDate: invoice.invoiceDate
        });
      }

      const aggregate = vendorMap.get(vendor)!;
      aggregate.invoiceCount += 1;
      aggregate.netValue += Math.abs(invoice.amount || 0);
      
      // Keep track of the latest invoice date
      if (new Date(invoice.invoiceDate) > new Date(aggregate.latestDate)) {
        aggregate.latestDate = invoice.invoiceDate;
      }
    });

    // Convert to array and sort by net value descending
    return Array.from(vendorMap.values())
      .sort((a, b) => b.netValue - a.netValue);
  }, [invoices]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Invoices by Vendor</h3>
            <p className="text-xs text-gray-500 mt-1">Top vendors by invoice count and net value.</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    # Invoices
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendorAggregates.map((aggregate, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{aggregate.vendor}</div>
                      <div className="text-xs text-gray-500">{formatDate(aggregate.latestDate)}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {aggregate.invoiceCount}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      € {aggregate.netValue.toLocaleString('de-DE', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Showing {vendorAggregates.length} vendors with {invoices.length} total invoices
        </div>
      </div>
    </div>
  );
};
