
import React, { useState, useEffect } from 'react';
import { SavedProject, ProjectType } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { VideoCameraIcon, PlusIcon, EyeIcon, CheckCircleIcon, BellIcon as AlertIcon, LightBulbIcon, ChatBubbleLeftEllipsisIcon } from '../components/icons';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import { TOTAL_DURATION_OPTIONS } from '../constants';


const ProjectCardFC: React.FC<{ project: SavedProject; onDelete: (id: string) => void; }> = ({ project, onDelete }) => {
    const navigate = useNavigate();

    const handleOpenProject = () => {
        if (project.projectType === 'storylineIdea' && project.storylineIdeaData) {
            navigate('/storyline-idea', { state: { savedProject: project } });
        } else { // storyboard or default
            navigate('/preview-storyboard', { state: { savedProject: project } });
        }
    };
    
    let displayTitle = "Untitled Project";
    let displayInfo = "";
    let projectIcon = <VideoCameraIcon className={`w-14 h-14 text-brand-teal`} />;

    if (project.projectType === 'storylineIdea' && project.storylineIdeaData) {
        displayTitle = project.storylineIdeaData.result.title;
        displayInfo = `Type: Storyline Idea • Genre: ${project.storylineIdeaData.genre}`;
        projectIcon = <ChatBubbleLeftEllipsisIcon className={`w-14 h-14 text-brand-teal`} />;
    } else if (project.projectType === 'storyboard' && project.formData) {
        displayTitle = project.formData.projectTitle;
        const durationValue = project.formData.totalDuration;
        const durationOption = TOTAL_DURATION_OPTIONS.find(opt => opt.value === durationValue);
        const durationLabel = durationOption ? durationOption.label : `${durationValue}s`;
        displayInfo = `Scenes: ${project.totalScenes || 0} • Shots: ${project.totalShots || 0} • Duration: ${durationLabel}`;
        // projectIcon remains VideoCameraIcon
    }


    return (
    <Card className="flex flex-col bg-neutral-50 dark:bg-neutral-800 p-5">
        <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center mb-4">
            {projectIcon}
        </div>
        <h4 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1.5 truncate" title={displayTitle}>{displayTitle}</h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1.5">{displayInfo}</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">Last Modified: {new Date(project.lastModified).toLocaleDateString()}</p>
        <div className="mt-auto grid grid-cols-2 gap-2.5">
            <Button variant="outline" size="md" onClick={handleOpenProject} className={`hover:text-black col-span-1`} leftIcon={<EyeIcon className="w-5 h-5"/>}>Open</Button>
            <Button
                variant="secondary"
                size="md"
                onClick={() => onDelete(project.id)}
                className="!bg-red-600 hover:!bg-red-500 dark:!bg-red-700 dark:hover:!bg-red-600 text-white col-span-1"
            >
                Delete
            </Button>
        </div>
    </Card>
    );
};
ProjectCardFC.displayName = 'ProjectCardFC';


const MyProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [toastInfo, setToastInfo] = useState<{ show: boolean; message: string; type: 'success' | 'error', icon?: React.ReactNode }>({ show: false, message: '', type: 'success' });


  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjectsString = localStorage.getItem('nufa-projects');
        if (savedProjectsString) {
          const parsedProjects: SavedProject[] = JSON.parse(savedProjectsString);
           if (Array.isArray(parsedProjects)) {
            const validProjects = parsedProjects.filter(p => p && p.id && p.lastModified && p.projectType && (
                (p.projectType === 'storyboard' && p.formData) ||
                (p.projectType === 'storylineIdea' && p.storylineIdeaData)
                // Removed videoInsight check
            ));
            validProjects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
            setProjects(validProjects);
          } else {
            console.warn("Loaded projects data from localStorage is not an array. Resetting.");
            localStorage.removeItem('nufa-projects');
            setProjects([]);
          }
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to load projects from localStorage:", error);
        setProjects([]);
      }
    };
    loadProjects();
  }, []);
  
  const handleDeleteProject = (idToDelete: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        const updatedProjects = projects.filter(p => p.id !== idToDelete);
        setProjects(updatedProjects);
        localStorage.setItem('nufa-projects', JSON.stringify(updatedProjects));
        setToastInfo({
          show: true,
          message: 'Project deleted successfully!',
          type: 'success',
          icon: <CheckCircleIcon className="w-5 h-5 text-white" />
        });
      } catch (error) {
        console.error("Error deleting project:", error);
        setToastInfo({
          show: true,
          message: 'Failed to delete project. Please try again.',
          type: 'error',
          icon: <AlertIcon className="w-5 h-5 text-white" />
        });
      }
    }
  };

  const handleDuplicateProject = (idToDuplicate: string) => {
    const projectToDuplicate = projects.find(p => p.id === idToDuplicate);
    if (projectToDuplicate) {
      let duplicatedProject: SavedProject;
      let originalTitle = "Project";

      if (projectToDuplicate.projectType === 'storylineIdea' && projectToDuplicate.storylineIdeaData) {
        originalTitle = projectToDuplicate.storylineIdeaData.result.title;
        duplicatedProject = {
          ...JSON.parse(JSON.stringify(projectToDuplicate)),
          id: `storyline-${Date.now().toString()}`,
          lastModified: new Date().toISOString(),
          storylineIdeaData: {
            ...projectToDuplicate.storylineIdeaData,
            result: {
                ...projectToDuplicate.storylineIdeaData.result,
                title: `${originalTitle.replace(/ \(Copy\)*$/, "")} (Copy)`
            }
          }
        };
      } else if (projectToDuplicate.projectType === 'storyboard' && projectToDuplicate.formData) {
        originalTitle = projectToDuplicate.formData.projectTitle;
        duplicatedProject = {
          ...JSON.parse(JSON.stringify(projectToDuplicate)),
          id: `storyboard-${Date.now().toString()}`,
          lastModified: new Date().toISOString(),
          formData: {
              ...projectToDuplicate.formData,
              projectTitle: `${originalTitle.replace(/ \(Copy\)*$/, "")} (Copy)`
          }
        };
      } else { // Removed videoInsight handling
        setToastInfo({ show: true, message: "Cannot duplicate project: Invalid project data.", type: 'error', icon: <AlertIcon />});
        return;
      }
      
      const updatedProjects = [duplicatedProject, ...projects];
      updatedProjects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      setProjects(updatedProjects);
      localStorage.setItem('nufa-projects', JSON.stringify(updatedProjects));
      setToastInfo({
        show: true,
        message: `Project "${originalTitle}" duplicated.`,
        type: 'success',
        icon: <CheckCircleIcon className="w-5 h-5 text-white" />
      });
    }
  };

  return (
    <div className="p-6 md:p-8 text-neutral-900 dark:text-neutral-100">
      {toastInfo.show && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo({ show: false, message: '', type: 'success', icon: undefined })}
          icon={toastInfo.icon}
        />
      )}
      <div className="flex justify-between items-center mb-10">
        <span className="text-4xl font-bold text-neutral-900 dark:text-white">My Projects</span>
        <Link to="/generate">
            <Button variant="primary" leftIcon={<PlusIcon className="w-6 h-6" />} size="lg">Create New Project</Button>
        </Link>
      </div>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map(project => (
              <ProjectCardFC
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
        </div>
      ) : (
        <Card className="text-center py-16 bg-neutral-50 dark:bg-neutral-800">
            <VideoCameraIcon className="w-20 h-20 text-neutral-400 dark:text-neutral-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">No projects yet</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">Start by creating your first storyboard project or storyline idea.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/generate">
                    <Button variant="primary" size="lg">Create New Storyboard</Button>
                </Link>
                <Link to="/storyline-idea">
                    <Button variant="secondary" size="lg">Generate Storyline Idea</Button>
                </Link>
            </div>
        </Card>
      )}
    </div>
  );
};
MyProjectsPage.displayName = 'MyProjectsPage';

export default MyProjectsPage;
