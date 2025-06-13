
import React from 'react';
// import { ACCENT_COLOR } from '../../constants'; // No longer needed here directly

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string; 
  label?: string;
  error?: string;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = React.memo(({ 
  label,
  id, 
  error,
  rows = 3,
  className = '',
  disabled,
  ...restProps
}) => {
  const baseClasses = `block w-full rounded-md shadow-sm p-2.5 sm:text-base resize-vertical`; // Changed from sm:text-sm
  const lightModeClasses = `bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:ring-offset-2`;
  // Dark mode: black background, white text
  const darkModeClasses = `dark:bg-black dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-offset-black`;

  // Updated to use static class names
  const focusClasses = `focus:ring-brand-teal focus:border-brand-teal`;
  
  const errorClasses = error 
    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-neutral-300 dark:border-neutral-700';

  // Disabled: very dark gray background for black inputs
  const disabledClasses = disabled 
    ? 'disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:text-neutral-500 dark:disabled:text-neutral-400 disabled:cursor-not-allowed opacity-70' 
    : '';

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-base font-medium text-neutral-700 dark:text-neutral-100 mb-1.5">{label}</label>} {/* Changed from text-sm, mb-1 to mb-1.5 */}
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        className={`${baseClasses} ${lightModeClasses} ${darkModeClasses} ${focusClasses} ${errorClasses} ${disabledClasses} ${className}`}
        {...restProps}
      />
      {error && <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>} {/* Changed from text-xs */}
    </div>
  );
});
Textarea.displayName = 'Textarea';
export default Textarea;