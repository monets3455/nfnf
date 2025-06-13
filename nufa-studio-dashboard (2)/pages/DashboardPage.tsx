
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusIcon, VideoCameraIcon, ClockIcon, Squares2X2Icon, ArrowUpIcon, EyeIcon, LightBulbIcon, ChatBubbleLeftEllipsisIcon } from '../components/icons';
import { PRO_TIPS_DATA, TOTAL_DURATION_OPTIONS } from '../constants'; 
import { SavedProject, ProjectType } from '../types';


const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeColor?: string }> = ({ title, value, icon, change, changeColor = 'text-green-500 dark:text-green-400' }) => (
    <Card className="flex-1 min-w-[220px]">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
            <div className={`p-2.5 rounded-md bg-brand-teal bg-opacity-20 text-brand-teal`}>
                {icon}
            </div>
        </div>
        <p className="text-4xl font-bold text-neutral-900 dark:text-white">{value}</p>
        {change && <p className={`text-sm mt-1 ${changeColor}`}>{change}</p>}
    </Card>
);

const ProjectCardInternalFC: React.FC<{ project: SavedProject, navigate: ReturnType<typeof useNavigate> }> = ({ project, navigate }) => {
    let displayTitle = "Untitled Project";
    let displayInfo = "";
    let projectIcon = <VideoCameraIcon className={`w-14 h-14 text-brand-teal`} />;
    
    const handleOpenProject = () => {
      if (project.projectType === 'storylineIdea' && project.storylineIdeaData) {
        navigate('/storyline-idea', { state: { savedProject: project } });
      } else { // storyboard or default
        navigate('/preview-storyboard', { state: { savedProject: project } });
      }
    };

    if (project.projectType === 'storylineIdea' && project.storylineIdeaData) {
        displayTitle = project.storylineIdeaData.result.title;
        displayInfo = `Type: Storyline Idea • Genre: ${project.storylineIdeaData.genre}`;
        projectIcon = <ChatBubbleLeftEllipsisIcon className={`w-14 h-14 text-brand-teal`} />;
    } else if (project.projectType === 'storyboard' && project.formData) {
        displayTitle = project.formData.projectTitle;
        displayInfo = `Scenes: ${project.totalScenes || 0} • Shots: ${project.totalShots || 0}`;
        // projectIcon remains VideoCameraIcon
    }


    return (
        <Card className="flex flex-col bg-neutral-100 dark:bg-neutral-800">
            <div className="aspect-video bg-neutral-300 dark:bg-neutral-700 rounded-md flex items-center justify-center mb-4">
                {projectIcon}
            </div>
            <h4 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1.5 truncate" title={displayTitle}>{displayTitle}</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1.5">{displayInfo}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">Last Modified: {new Date(project.lastModified).toLocaleDateString()}</p>
            <Button variant="outline" size="md" className={`mt-auto w-full hover:text-black`} onClick={handleOpenProject}>Open</Button>
        </Card>
    );
};


const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const navigate = useNavigate();
  const [recentActivityDisplayValue, setRecentActivityDisplayValue] = useState<string>("N/A");
  const [productivityDisplay, setProductivityDisplay] = useState<{value: string; changeText: string; color: string}>(
    { value: "0%", changeText: "vs previous 7 days", color: "text-neutral-500 dark:text-neutral-400"}
  );


  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjectsString = localStorage.getItem('nufa-projects');
        let parsedProjects: SavedProject[] = [];
        if (savedProjectsString) {
          const tempParsedProjects: SavedProject[] = JSON.parse(savedProjectsString);
          if (Array.isArray(tempParsedProjects)) {
            parsedProjects = tempParsedProjects.filter(p => p && p.id && p.lastModified && p.projectType && (
                (p.projectType === 'storyboard' && p.formData) ||
                (p.projectType === 'storylineIdea' && p.storylineIdeaData)
            ));
            parsedProjects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
          } else {
            console.warn("Loaded projects data from localStorage is not an array. Resetting.");
            localStorage.removeItem('nufa-projects');
          }
        }
        setProjects(parsedProjects);

        // Calculate Recent Activity
        if (parsedProjects.length > 0 && parsedProjects[0].lastModified) {
            const lastModDate = new Date(parsedProjects[0].lastModified);
            const today = new Date();
            const diffTime = today.getTime() - lastModDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) setRecentActivityDisplayValue("Recently");
            else if (diffDays === 0) setRecentActivityDisplayValue("Today");
            else if (diffDays === 1) setRecentActivityDisplayValue("Yesterday");
            else setRecentActivityDisplayValue(`${diffDays} days ago`);
        } else {
            setRecentActivityDisplayValue("N/A");
        }

        // Calculate Productivity
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(today.getDate() - 14);

        // Normalize dates to start of day for comparison
        const normalizeDate = (date: Date) => {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            return newDate;
        };

        const todayNormalized = normalizeDate(today);
        const sevenDaysAgoNormalized = normalizeDate(sevenDaysAgo);
        const fourteenDaysAgoNormalized = normalizeDate(fourteenDaysAgo);

        let currentPeriodCount = 0;
        let previousPeriodCount = 0;

        parsedProjects.forEach(project => {
            const projectDate = normalizeDate(new Date(project.lastModified));
            if (projectDate >= sevenDaysAgoNormalized && projectDate <= todayNormalized) {
                currentPeriodCount++;
            } else if (projectDate >= fourteenDaysAgoNormalized && projectDate < sevenDaysAgoNormalized) {
                previousPeriodCount++;
            }
        });
        
        let prodValue = "0%";
        let prodColor = "text-neutral-500 dark:text-neutral-400";
        const prodChangeText = "vs previous 7 days";

        if (previousPeriodCount === 0) {
            if (currentPeriodCount > 0) {
                prodValue = "+100%"; // Simplified: any new activity is a big positive jump
                prodColor = "text-brand-teal";
            }
        } else {
            const change = ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100;
            if (change > 0) {
                prodValue = `+${change.toFixed(0)}%`;
                prodColor = "text-brand-teal";
            } else if (change < 0) {
                prodValue = `${change.toFixed(0)}%`;
                prodColor = "text-red-500 dark:text-red-400";
            }
        }
        setProductivityDisplay({value: prodValue, changeText: prodChangeText, color: prodColor});

      } catch (error) {
        console.error("Failed to load projects from localStorage:", error);
        setProjects([]);
        setRecentActivityDisplayValue("N/A");
        setProductivityDisplay({ value: "Error", changeText: "", color: "text-red-500 dark:text-red-400"});
      }
    };
    loadProjects();
  }, []);


  return (
    <div className="p-6 md:p-8 space-y-10 text-neutral-900 dark:text-neutral-100">

      <Card className="bg-neutral-100 dark:bg-neutral-800">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-5">Pro Tips</h3>
        <ul className="space-y-4">
            {PRO_TIPS_DATA.map((tip, index) => (
                <li key={index} className="flex items-start">
                    <span className={`mr-4 mt-0.5 flex-shrink-0 w-7 h-7 bg-brand-teal text-black text-sm font-bold rounded-full flex items-center justify-center`}>{index + 1}</span>
                    <p className="text-base text-neutral-700 dark:text-neutral-300">{tip}</p>
                </li>
            ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Projects" value={projects.length.toString()} icon={<Squares2X2Icon className="w-6 h-6"/>} />
        <StatCard title="Recent Activity" value={recentActivityDisplayValue} icon={<ClockIcon className="w-6 h-6"/>} />
        <StatCard 
            title="Productivity" 
            value={productivityDisplay.value} 
            icon={<ArrowUpIcon className="w-6 h-6"/>} 
            change={productivityDisplay.changeText}
            changeColor={productivityDisplay.color} 
        />
      </div>
      
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">Recent Projects</h3>
            <Link to="/projects">
                <Button variant="ghost" size="md" rightIcon={<EyeIcon className="w-5 h-5" />}>View all projects</Button>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.slice(0, 3).map(project => <ProjectCardInternalFC key={project.id} project={project} navigate={navigate} />)}
             <Card className="flex flex-col items-center justify-center aspect-video bg-neutral-100 dark:bg-neutral-800 hover:border-brand-teal border-2 border-dashed border-neutral-300 dark:border-neutral-700 transition-colors">
                <Link to="/generate" className="text-center">
                    <PlusIcon className={`w-14 h-14 text-brand-teal mb-3 mx-auto`} />
                    <p className="text-lg text-neutral-900 dark:text-white font-semibold">Create New Project</p>
                </Link>
            </Card>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
