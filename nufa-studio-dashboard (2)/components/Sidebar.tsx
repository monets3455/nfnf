
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import { SIDEBAR_NAV_ITEMS } from '../constants'; // ACCENT_COLOR no longer needed directly
import { ArrowLeftOnRectangleIcon } from './icons';

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileSidebarOpen, closeMobileSidebar }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMobileSidebarOpen) {
      closeMobileSidebar();
    }
  };

  return (
    <div 
      className={`
        w-64 bg-neutral-50 dark:bg-black text-neutral-700 dark:text-neutral-300 
        flex flex-col h-screen p-4 shadow-lg border-r border-neutral-200 dark:border-neutral-800
        transition-transform duration-300 ease-in-out z-40
        md:fixed md:left-0 md:top-0 md:translate-x-0 
        fixed top-0 left-0 
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="mb-10">
        <Link to="/" onClick={handleLinkClick} className="flex items-center space-x-2">
          {/* Updated to use static class name */}
          <span className={`bg-brand-teal text-black font-bold text-2xl px-2.5 py-1.5 rounded`}>N</span> {/* Increased N logo size and padding */}
          <span className="text-2xl font-semibold text-neutral-800 dark:text-white">Nufa Studio</span> {/* Increased font size */}
        </Link>
      </div>
      <nav className="flex-grow">
        <ul>
          {SIDEBAR_NAV_ITEMS.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 text-base ${
                  // Updated to use static class name
                  location.pathname === item.path ? `bg-brand-teal text-black font-semibold` : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <item.icon className="w-6 h-6" /> {/* Increased icon size from w-5 h-5 */}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <button
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 text-base" // Ensured text-base
          onClick={() => {
            handleLinkClick(); 
            alert('Logout clicked');
          }}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" /> {/* Increased icon size from w-5 h-5 */}
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;