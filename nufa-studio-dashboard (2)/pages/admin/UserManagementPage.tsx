
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { MagnifyingGlassIcon } from '../../components/icons';

const UserManagementPage: React.FC = () => {
  const mockUsers = [
    { id: 'usr_1', email: 'user1@example.com', status: 'Active', plan: 'Pro', credits: 500, lastLogin: '2024-05-15' },
    { id: 'usr_2', email: 'user2@example.com', status: 'Suspended', plan: 'Free', credits: 0, lastLogin: '2024-05-10' },
    { id: 'usr_3', email: 'user3@example.com', status: 'Active', plan: 'Lite', credits: 150, lastLogin: '2024-05-16' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">User Management</h1>
        <Button variant="primary" size="md">Add New User</Button>
      </div>
      
      <Card className="mb-6 bg-neutral-800 border-neutral-700">
        <div className="flex space-x-4">
          <Input id="user-search" placeholder="Search users (email, ID)..." className="flex-grow !bg-neutral-700 !border-neutral-600" />
          <Button variant="secondary" leftIcon={<MagnifyingGlassIcon className="w-5 h-5"/>}>Search</Button>
        </div>
      </Card>

      <Card className="bg-neutral-800 border-neutral-700 p-0 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-neutral-700">
            <tr>
              {['Email', 'Status', 'Plan', 'Credits', 'Last Login', 'Actions'].map(header => (
                <th key={header} className="px-5 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-white">{user.email}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{user.plan}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{user.credits}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{user.lastLogin}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" className="!p-1.5 text-brand-teal hover:!bg-brand-teal/10">View</Button>
                  <Button variant="ghost" size="sm" className="!p-1.5 text-yellow-400 hover:!bg-yellow-400/10">Edit</Button>
                  <Button variant="ghost" size="sm" className="!p-1.5 text-red-500 hover:!bg-red-500/10">Suspend</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
UserManagementPage.displayName = "UserManagementPage";
export default UserManagementPage;
