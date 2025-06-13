

import React, { useEffect } from 'react';
import { XMarkIcon as CloseIcon, CheckCircleIcon as DefaultSuccessIcon } from '../icons'; // Renamed XMarkIcon to avoid conflict
import { ACCENT_COLOR } from '../../constants';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  icon?: React.ReactNode;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, icon }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  let baseBgColor = 'bg-neutral-800 dark:bg-neutral-700';
  let baseTextColor = 'text-white dark:text-neutral-100';
  let iconColorClass = `text-${ACCENT_COLOR}`; // Default for custom icon if no type matches or if icon is custom for info
  let effectiveIcon = icon;

  if (type === 'success') {
    baseBgColor = 'bg-green-600 dark:bg-green-500';
    baseTextColor = 'text-white';
    iconColorClass = 'text-white'; // Icons for success type should be white
    if (!icon) effectiveIcon = <DefaultSuccessIcon className={`w-6 h-6 ${iconColorClass}`} />;
  } else if (type === 'error') {
    baseBgColor = 'bg-red-600 dark:bg-red-500';
    baseTextColor = 'text-white';
    iconColorClass = 'text-white'; // Icons for error type should be white
    // Example: if (!icon) effectiveIcon = <ErrorIcon className={`w-6 h-6 ${iconColorClass}`} />;
  } else if (type === 'info') {
     baseBgColor = `bg-${ACCENT_COLOR} dark:bg-${ACCENT_COLOR}`; // Teal background for info
     baseTextColor = 'text-black'; // Black text on teal
     iconColorClass = 'text-black'; // Icons for info type should be black to contrast with teal
     // Example: if (!icon) effectiveIcon = <InfoIcon className={`w-6 h-6 ${iconColorClass}`} />;
  }
  
  return (
    <div 
      className={`fixed top-5 right-5 md:top-8 md:right-8 p-4 rounded-lg shadow-2xl ${baseBgColor} ${baseTextColor} flex items-center space-x-3 z-[100] max-w-md transition-all duration-300 ease-in-out animate-fadeInRight`}
      role="alert"
      aria-live="assertive" 
      aria-atomic="true"
    >
      {effectiveIcon && React.isValidElement(effectiveIcon) ? 
        React.cloneElement(effectiveIcon as React.ReactElement<{ className?: string }>, { 
          className: `w-7 h-7 ${iconColorClass} flex-shrink-0` // Increased icon size
        }) : 
      null}
      <span className="flex-grow text-base font-medium">{message}</span> {/* Increased text-sm to text-base */}
      <button 
        onClick={onClose} 
        className={`p-1 rounded-full hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors flex-shrink-0 ${
          iconColorClass === 'text-white' || iconColorClass === 'text-black' // For success, error, info
          ? `${iconColorClass === 'text-white' ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'}` 
          : `text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white` // Fallback for other custom icons on default bg
        }`}
        aria-label="Close notification"
      >
        <CloseIcon className="w-6 h-6" /> {/* Increased icon size */}
      </button>
      <style>
        {`
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeInRight {
            animation-name: fadeInRight;
            animation-duration: 0.3s;
            animation-timing-function: ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Toast;