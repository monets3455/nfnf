
import React from 'react';
import Card from '../../components/ui/Card';

const ApiUsageLogPage: React.FC = () => {
  // Mock data for API usage logs
  const mockApiLogs = [
    { id: 'log_gpt_1', user: 'user1@example.com', service: 'GPT (Text)', tokens: 500, timestamp: '2024-05-16 10:00 AM' },
    { id: 'log_flux_1', user: 'user2@example.com', service: 'Flux Kontext (Image)', images: 1, timestamp: '2024-05-16 10:05 AM' },
    { id: 'log_veo3_1', user: 'user1@example.com', service: 'Veo 3 (Video)', duration_s: 5, timestamp: '2024-05-16 10:10 AM' },
    { id: 'log_gpt_2', user: 'user3@example.com', service: 'GPT (Text)', tokens: 1200, timestamp: '2024-05-16 10:15 AM' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">API Usage Log</h1>
      <Card className="bg-neutral-800 border-neutral-700 p-0 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-neutral-700">
            <tr>
              {['Log ID', 'User', 'Service', 'Usage Detail', 'Timestamp'].map(header => (
                <th key={header} className="px-5 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {mockApiLogs.map(log => (
              <tr key={log.id}>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{log.id}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-white">{log.user}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{log.service}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">
                  {log.tokens ? `${log.tokens} tokens` : log.images ? `${log.images} image(s)` : log.duration_s ? `${log.duration_s}s video` : 'N/A'}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
ApiUsageLogPage.displayName = "ApiUsageLogPage";
export default ApiUsageLogPage;
