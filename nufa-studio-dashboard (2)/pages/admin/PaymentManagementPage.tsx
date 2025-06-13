
import React from 'react';
import Card from '../../components/ui/Card';

const PaymentManagementPage: React.FC = () => {
   const mockPayments = [
    { id: 'txn_1', user: 'user1@example.com', amount: '$19.99', status: 'Success', date: '2024-05-15', gateway: 'Stripe' },
    { id: 'txn_2', user: 'user2@example.com', amount: '$49.99', status: 'Pending', date: '2024-05-16', gateway: 'Xendit' },
    { id: 'txn_3', user: 'user3@example.com', amount: '$9.99', status: 'Failed', date: '2024-05-14', gateway: 'Midtrans' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Payment Management</h1>
      <Card className="bg-neutral-800 border-neutral-700 p-0 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-neutral-700">
            <tr>
              {['Transaction ID', 'User', 'Amount', 'Status', 'Date', 'Gateway', 'Actions'].map(header => (
                <th key={header} className="px-5 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {mockPayments.map(payment => (
              <tr key={payment.id}>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{payment.id}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-white">{payment.user}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{payment.amount}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Success' ? 'bg-green-600 text-green-100' : 
                    payment.status === 'Pending' ? 'bg-yellow-600 text-yellow-100' : 
                    'bg-red-600 text-red-100'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{payment.date}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{payment.gateway}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-brand-teal hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
PaymentManagementPage.displayName = "PaymentManagementPage";
export default PaymentManagementPage;
