
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Routes, Route, useLocation, Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import GenerateStoryboardPage from './pages/GenerateStoryboardPage.tsx';
import MyProjectsPage from './pages/MyProjectsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import PreviewStoryboardPage from './pages/PreviewStoryboardPage.tsx';
import StorylineIdeaPage from './pages/StorylineIdeaPage';
// import VideoInsightPage from './pages/VideoInsightPage'; // Removed
import LandingPage from './pages/LandingPage'; // Changed from { LandingPage }
import AuthPage from './pages/AuthPage.tsx';
import { BellIcon, UserCircleIcon, CogIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon } from './components/icons';
import { useTheme } from './contexts/ThemeContext';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.tsx';
import UserManagementPage from './pages/admin/UserManagementPage.tsx';
import PackagePricingPage from './pages/admin/PackagePricingPage.tsx';
import PaymentManagementPage from './pages/admin/PaymentManagementPage.tsx';
import ApiUsageLogPage from './pages/admin/ApiUsageLogPage.tsx';
import ApiCreditSettingsPage from './pages/admin/ApiCreditSettingsPage.tsx';
import ProjectMonitorPage from './pages/admin/ProjectMonitorPage.tsx';
import NotificationBroadcastPage from './pages/admin/NotificationBroadcastPage.tsx';
import ActivityLogPage from './pages/admin/ActivityLogPage.tsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.tsx';


// Mock Auth Context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (callback?: () => void) => void;
  logout: (callback?: () => void) => void;
  // isAdmin: boolean; // Conceptually, you'd have role management
}
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) as AuthContextType;

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('nufa-auth') === 'true');
  // const [isAdmin, setIsAdmin] = useState(true); // Mock: assume user is admin after login for demo

  const login = (callback?: () => void) => {
    localStorage.setItem('nufa-auth', 'true');
    setIsAuthenticated(true);
    // setIsAdmin(true); // Mock
    if (callback) callback();
  };
  const logout = (callback?: () => void) => {
    localStorage.removeItem('nufa-auth');
    setIsAuthenticated(false);
    // setIsAdmin(false); // Mock
    if (callback) callback();
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout /*, isAdmin */ }}>
      {children}
    </AuthContext.Provider>
  );
};


// Protected Route Component
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

// Mock Admin Route (could be enhanced with role checks)
const AdminRoute: React.FC = () => {
  const { isAuthenticated /*, isAdmin */ } = useAuth();
  const location = useLocation();

  // For this demo, any authenticated user can access admin. 
  // In a real app, you'd check `isAdmin` or a role.
  if (!isAuthenticated /* || !isAdmin */) { 
    return <Navigate to="/dashboard" state={{ from: location }} replace />; // Or to a "Forbidden" page
  }
  return <Outlet />;
};


const AppHeader: React.FC<{ onToggleSidebar: () => void; isMobileSidebarOpen: boolean; pageTitle: string; onLogout: () => void;}> = ({ onToggleSidebar, isMobileSidebarOpen, pageTitle, onLogout }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-brand-dark backdrop-blur-md shadow-sm dark:shadow-none border-b border-neutral-200 dark:border-neutral-800 p-4 px-6 md:px-8 flex justify-between items-center">
      <div className="flex items-center flex-1 min-w-0">
        <button
          className={`mr-2 sm:mr-3 text-neutral-500 dark:text-neutral-400 hover:text-brand-teal md:hidden`}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isMobileSidebarOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-white truncate pr-2 sm:pr-4">{pageTitle}</h1>
      </div>
      <div className="flex items-center flex-shrink-0 space-x-3 sm:space-x-5 ml-2 sm:ml-4">
          <button className={`text-neutral-500 dark:text-neutral-400 hover:text-brand-teal transition-colors`}>
              <BellIcon className="w-7 h-7" />
          </button>
          <div className="relative" ref={profileDropdownRef}>
              <button
                  onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-teal flex items-center justify-center text-black font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-dark focus:ring-brand-teal`}
                  aria-label="User menu" aria-expanded={isProfileDropdownOpen} aria-haspopup="true"
              >
                  NS
              </button>
              {isProfileDropdownOpen && (
                  <div
                      className="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg py-1.5 bg-white dark:bg-brand-bg-card ring-1 ring-black ring-opacity-5 dark:ring-neutral-700 focus:outline-none z-40"
                      role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                  >
                      <Link
                          to="/settings" onClick={() => { setIsProfileDropdownOpen(false); }}
                          className="flex items-center px-4 py-2.5 text-base text-neutral-700 dark:text-neutral-300 hover:bg-brand-teal hover:text-black w-full text-left transition-colors" role="menuitem"
                      >
                          <UserCircleIcon className="w-6 h-6 mr-3" /> Profile
                      </Link>
                       <Link
                          to="/settings" onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-base text-neutral-700 dark:text-neutral-300 hover:bg-brand-teal hover:text-black w-full text-left transition-colors" role="menuitem"
                      >
                          <CogIcon className="w-6 h-6 mr-3" /> Settings
                      </Link>
                      <button
                          onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }}
                          className="flex items-center px-4 py-2.5 text-base text-neutral-700 dark:text-neutral-300 hover:bg-brand-teal hover:text-black w-full text-left transition-colors" role="menuitem"
                      >
                          <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" /> Logout
                      </button>
                  </div>
              )}
          </div>
      </div>
    </header>
  );
};

// Layout for main application (includes Sidebar and Header)
const AppLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const getPageTitle = () => {
    const { state } = location;
    const projectTitle = (state as { generatedData?: { formData?: { projectTitle: string } }, savedProject?: { formData?: { projectTitle: string } } })?.generatedData?.formData?.projectTitle ||
                         (state as { savedProject?: { formData?: { projectTitle: string } } })?.savedProject?.formData?.projectTitle;

    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/generate': return 'Generate New Storyboard';
      case '/storyline-idea': return 'Storyline Idea Generator';
      // case '/video-insight': return 'Video Insight Analyzer'; // Removed
      case '/projects': return 'My Projects';
      case '/settings': return 'Settings';
      case '/help': return 'Help & Tutorials';
      case '/preview-storyboard': return `Preview: ${projectTitle || 'Storyboard'}`;
      default: return 'Nufa Studio';
    }
  };
  
  const pageTitle = getPageTitle();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    document.title = `${pageTitle} - Nufa Studio`;
  }, [location.pathname, pageTitle]);
  
  const handleLogout = () => {
    logout(() => navigate('/signin'));
  };

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-brand-bg-dark">
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out md:ml-64 ${isMobileSidebarOpen ? 'blur-sm md:blur-none pointer-events-none md:pointer-events-auto' : ''}`}>
        <AppHeader
            onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            isMobileSidebarOpen={isMobileSidebarOpen}
            pageTitle={pageTitle}
            onLogout={handleLogout}
        />
        <Outlet />
      </main>
    </div>
  );
};


const AppCore: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<AuthPage mode="signin" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/forgot-password" element={<AuthPage mode="forgot-password" />} />
      
      {/* User-facing application routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/generate" element={<GenerateStoryboardPage />} />
          <Route path="/storyline-idea" element={<StorylineIdeaPage />} />
          {/* <Route path="/video-insight" element={<VideoInsightPage />} /> */} {/* Removed route for Video Insight */}
          <Route path="/projects" element={<MyProjectsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/preview-storyboard" element={<PreviewStoryboardPage />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute />}> {/* Use AdminRoute or a more specific one */}
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="package-pricing" element={<PackagePricingPage />} />
          <Route path="payment-management" element={<PaymentManagementPage />} />
          <Route path="api-usage-log" element={<ApiUsageLogPage />} />
          <Route path="api-credit-settings" element={<ApiCreditSettingsPage />} />
          <Route path="project-monitor" element={<ProjectMonitorPage />} />
          <Route path="notification-broadcast" element={<NotificationBroadcastPage />} />
          <Route path="activity-log" element={<ActivityLogPage />} />
          <Route path="admin-settings" element={<AdminSettingsPage />} />
          <Route index element={<Navigate to="dashboard" replace />} /> {/* Default admin page */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppCore />
  </AuthProvider>
);

App.displayName = 'App';
export default App;