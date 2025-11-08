import { useState } from 'react';
import { Users, Building, DollarSign } from 'lucide-react';
import type { SimpleInvoice } from '../../types/invoice';

interface RoleBasedViewProps {
  invoices: SimpleInvoice[];
}

type Role = 'admin' | 'finance' | 'operations';

export default function RoleBasedView({ invoices }: RoleBasedViewProps) {
  const [selectedRole, setSelectedRole] = useState<Role>('admin');

  const getRoleData = () => {
    switch (selectedRole) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          icon: <Users className="w-5 h-5" />,
          metrics: [
            { label: 'Total Invoices', value: invoices.length },
            { label: 'Total Value', value: `€${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}` },
            { label: 'Vendors', value: new Set(invoices.map(i => i.vendorName)).size },
            { label: 'Avg Invoice', value: `€${(invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length).toFixed(2)}` }
          ]
        };
      case 'finance':
        const processed = invoices.filter(i => i.status === 'processed').length;
        return {
          title: 'Finance View',
          icon: <DollarSign className="w-5 h-5" />,
          metrics: [
            { label: 'Processed', value: processed },
            { label: 'Pending', value: invoices.length - processed },
            { label: 'Total Payable', value: `€${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}` },
            { label: 'Processing Rate', value: `${((processed / invoices.length) * 100).toFixed(1)}%` }
          ]
        };
      case 'operations':
        return {
          title: 'Operations View',
          icon: <Building className="w-5 h-5" />,
          metrics: [
            { label: 'Active Vendors', value: new Set(invoices.map(i => i.vendorName)).size },
            { label: 'This Month', value: invoices.filter(i => new Date(i.invoiceDate).getMonth() === new Date().getMonth()).length },
            { label: 'Avg Processing Time', value: '3.2 days' },
            { label: 'Total Documents', value: invoices.length }
          ]
        };
    }
  };

  const roleData = getRoleData();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role-Based View</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRole('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRole === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setSelectedRole('finance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRole === 'finance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Finance
          </button>
          <button
            onClick={() => setSelectedRole('operations')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRole === 'operations'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Operations
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          {roleData.icon}
          <h3 className="text-lg font-semibold text-gray-900">{roleData.title}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {roleData.metrics.map((metric, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
