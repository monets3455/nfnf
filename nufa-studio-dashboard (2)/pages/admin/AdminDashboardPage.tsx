
import React from 'react';
import Card from '../../components/ui/Card';

const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-400">Total Users</h3>
          <p className="text-3xl font-bold text-white mt-1">1,234 (Mock)</p>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-400">Active Users (24h)</h3>
          <p className="text-3xl font-bold text-white mt-1">156 (Mock)</p>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-400">Total Revenue</h3>
          <p className="text-3xl font-bold text-white mt-1">$5,678 (Mock)</p>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-400">API Calls (Today)</h3>
          <p className="text-3xl font-bold text-white mt-1">10,200 (Mock)</p>
        </Card>
      </div>
      {/* Add more dashboard elements like charts or recent activity logs here */}
    </div>
  );
};
AdminDashboardPage.displayName = "AdminDashboardPage";
export default AdminDashboardPage;
