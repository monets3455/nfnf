
import React from 'react';
import Card from '../../components/ui/Card';

const ActivityLogPage: React.FC = () => {
  const mockLogs = [
    { id: 'act_1', user: 'admin@nufa.com', action: 'Updated Pro Plan price', ip: '192.168.1.1', timestamp: '2024-05-16 11:00 AM' },
    { id: 'act_2', user: 'user1@example.com', action: 'Generated storyboard "My First Movie"', ip: '10.0.0.5', timestamp: '2024-05-16 10:55 AM' },
    { id: 'act_3', user: 'support@nufa.com', action: 'Suspended user user2@example.com', ip: '192.168.1.2', timestamp: '2024-05-16 10:50 AM' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Activity Log & Audit</h1>
      <Card className="bg-neutral-800 border-neutral-700 p-0 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-neutral-700">
            <tr>
              {['Timestamp', 'User', 'Action', 'IP Address', 'Details'].map(header => (
                <th key={header} className="px-5 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {mockLogs.map(log => (
              <tr key={log.id}>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{log.timestamp}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-white">{log.user}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{log.action}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{log.ip}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-brand-teal hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
ActivityLogPage.displayName = "ActivityLogPage";
export default ActivityLogPage;
