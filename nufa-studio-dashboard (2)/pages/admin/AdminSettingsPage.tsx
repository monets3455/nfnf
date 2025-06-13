
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const AdminSettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Admin Account Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <h2 className="text-xl font-semibold text-white mb-4">Manage Admin Accounts</h2>
          {/* Placeholder for listing admin users and adding new ones */}
          <p className="text-neutral-400 mb-4">List of admin users will appear here. (Mock)</p>
          <Button variant="primary">Add New Admin</Button>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
          <form className="space-y-4">
            <Input id="admin-current-password" label="Your Current Password" type="password" className="!bg-neutral-700 !border-neutral-600" />
            <Input id="admin-new-password" label="New Password" type="password" className="!bg-neutral-700 !border-neutral-600" />
            <Input id="admin-confirm-password" label="Confirm New Password" type="password" className="!bg-neutral-700 !border-neutral-600" />
            <label className="flex items-center text-base text-neutral-300">
                <input type="checkbox" className="form-checkbox h-5 w-5 rounded text-brand-teal bg-neutral-700 border-neutral-600 focus:ring-brand-teal focus:ring-offset-neutral-800"/>
                <span className="ml-2">Enable Two-Factor Authentication</span>
            </label>
            <Button variant="primary" type="submit">Update Security Settings</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
AdminSettingsPage.displayName = "AdminSettingsPage";
export default AdminSettingsPage;
