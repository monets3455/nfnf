
import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App'; 
import { ADMIN_SIDEBAR_NAV_ITEMS } from '../../constants';
import { AdminNavItem } from '../../types';
import { Bars3Icon, XMarkIcon, BellIcon, CogIcon, ArrowLeftOnRectangleIcon, UserCircleIcon } from '../../components/icons';

const AdminSidebar: React.FC<{ isMobileSidebarOpen: boolean; closeMobileSidebar: () => void; }> = ({ isMobileSidebarOpen, closeMobileSidebar }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMobileSidebarOpen) {
      closeMobileSidebar();
    }
  };

  return (
    <div
      className={`
        w-64 bg-neutral-800 text-neutral-300 
        flex flex-col h-screen p-4 shadow-lg border-r border-neutral-700
        transition-transform duration-300 ease-in-out z-40
        md:fixed md:left-0 md:top-0 md:translate-x-0 
        fixed top-0 left-0 
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="mb-10">
        <Link to="/admin/dashboard" onClick={handleLinkClick} className="flex items-center space-x-2">
          <span className={`bg-brand-teal text-black font-bold text-2xl px-2.5 py-1.5 rounded`}>A</span>
          <span className="text-2xl font-semibold text-white">Nufa Admin</span>
        </Link>
      </div>
      <nav className="flex-grow">
        <ul>
          {ADMIN_SIDEBAR_NAV_ITEMS.map((item: AdminNavItem) => (
            <li key={item.name} className="mb-2">
              <Link
                to={`/admin/${item.path}`}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md hover:bg-neutral-700 hover:text-white transition-colors duration-150 text-base ${
                  location.pathname === `/admin/${item.path}` || (location.pathname === '/admin' && item.path === 'dashboard') 
                  ? `bg-brand-teal text-black font-semibold` 
                  : 'text-neutral-400'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <Link
          to="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors duration-150 text-base"
        >
          <UserCircleIcon className="w-6 h-6" />
          <span>Back to App</span>
        </Link>
      </div>
    </div>
  );
};

const AdminHeader: React.FC<{ onToggleSidebar: () => void; isMobileSidebarOpen: boolean; pageTitle: string; onLogout: () => void; }> = ({ onToggleSidebar, isMobileSidebarOpen, pageTitle, onLogout }) => {
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
        <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur-md shadow-sm border-b border-neutral-700 p-4 px-6 md:px-8 flex justify-between items-center">
            <div className="flex items-center flex-1 min-w-0">
            <button
                className={`mr-2 sm:mr-3 text-neutral-400 hover:text-brand-teal md:hidden`}
                onClick={onToggleSidebar}
                aria-label="Toggle admin sidebar"
            >
                {isMobileSidebarOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
            <h1 className="text-2xl font-semibold text-white truncate pr-2 sm:pr-4">{pageTitle}</h1>
            </div>
            <div className="flex items-center flex-shrink-0 space-x-3 sm:space-x-5 ml-2 sm:ml-4">
                <button className={`text-neutral-400 hover:text-brand-teal transition-colors`}>
                    <BellIcon className="w-7 h-7" />
                </button>
                <div className="relative" ref={profileDropdownRef}>
                    <button
                        onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-teal flex items-center justify-center text-black font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 focus:ring-brand-teal`}
                        aria-label="Admin menu" aria-expanded={isProfileDropdownOpen} aria-haspopup="true"
                    >
                        AD
                    </button>
                    {isProfileDropdownOpen && (
                        <div
                            className="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg py-1.5 bg-neutral-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-40"
                            role="menu" aria-orientation="vertical" aria-labelledby="admin-menu-button"
                        >
                            <Link
                                to="/admin/admin-settings" onClick={() => { setIsProfileDropdownOpen(false); }}
                                className="flex items-center px-4 py-2.5 text-base text-neutral-300 hover:bg-brand-teal hover:text-black w-full text-left transition-colors" role="menuitem"
                            >
                                <CogIcon className="w-6 h-6 mr-3" /> Admin Settings
                            </Link>
                            <button
                                onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }}
                                className="flex items-center px-4 py-2.5 text-base text-neutral-300 hover:bg-brand-teal hover:text-black w-full text-left transition-colors" role="menuitem"
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


const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const getAdminPageTitle = () => {
    const currentPath = location.pathname.replace('/admin/', '');
    const navItem = ADMIN_SIDEBAR_NAV_ITEMS.find(item => item.path === currentPath);
    return navItem ? navItem.name : 'Admin Panel';
  };
  
  const pageTitle = getAdminPageTitle();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    document.title = `${pageTitle} - Nufa Admin`;
  }, [location.pathname, pageTitle]);
  
  const handleLogout = () => {
    logout(() => navigate('/signin'));
  };

  return (
    <div className="flex h-screen bg-brand-dark text-neutral-300">
      <AdminSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out md:ml-64 ${isMobileSidebarOpen ? 'blur-sm md:blur-none pointer-events-none md:pointer-events-auto' : ''}`}>
        <AdminHeader
            onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            isMobileSidebarOpen={isMobileSidebarOpen}
            pageTitle={pageTitle}
            onLogout={handleLogout}
        />
        <div className="p-4 md:p-6"> {/* Added padding around Outlet */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
