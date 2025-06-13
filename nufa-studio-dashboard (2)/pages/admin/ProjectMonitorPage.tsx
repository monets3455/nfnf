
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ProjectMonitorPage: React.FC = () => {
  const mockProjects = [
    { id: 'proj_1', title: 'Epic Adventure Movie', user: 'user1@example.com', type: 'Storyboard', scenes: 10, lastUpdated: '2024-05-15' },
    { id: 'proj_2', title: 'Sci-Fi Short Film Concept', user: 'user2@example.com', type: 'Storyline Idea', lastUpdated: '2024-05-14' },
    { id: 'proj_3', title: 'Marketing Video Ad', user: 'user3@example.com', type: 'Storyboard', scenes: 5, lastUpdated: '2024-05-16' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Project / Storyboard Monitor</h1>
       <Card className="bg-neutral-800 border-neutral-700 p-0 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-neutral-700">
            <tr>
              {['Project Title', 'User', 'Type', 'Details', 'Last Updated', 'Actions'].map(header => (
                <th key={header} className="px-5 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {mockProjects.map(project => (
              <tr key={project.id}>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-white">{project.title}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{project.user}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{project.type}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{project.scenes ? `${project.scenes} scenes` : '-'}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-300">{project.lastUpdated}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" className="!p-1.5 text-brand-teal hover:!bg-brand-teal/10">View Project</Button>
                  <Button variant="ghost" size="sm" className="!p-1.5 text-yellow-400 hover:!bg-yellow-400/10">Clone</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
ProjectMonitorPage.displayName = "ProjectMonitorPage";
export default ProjectMonitorPage;
