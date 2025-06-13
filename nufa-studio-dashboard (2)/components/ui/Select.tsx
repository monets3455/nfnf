
import React from 'react';
import { ChevronDownIcon } from '../icons';
// import { ACCENT_COLOR } from '../../constants'; // No longer needed here directly

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string } | string>;
  isMulti?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  id, 
  error, 
  options, 
  className = '', 
  isMulti = false, 
  placeholder,
  value: selectValue,
  ...restProps
}) => {
  const selectOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const baseClasses = `block w-full rounded-md shadow-sm p-2.5 sm:text-base appearance-none`; // Changed from sm:text-sm
  const lightModeClasses = `bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:ring-offset-2`;
  // Dark mode: black background, white text
  const darkModeClasses = `dark:bg-black dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-offset-black`; 
  
  // Updated to use static class names
  const focusClasses = `focus:ring-brand-teal focus:border-brand-teal`;
  
  const errorClasses = error 
    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-neutral-300 dark:border-neutral-700'; 
  
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-base font-medium text-neutral-700 dark:text-neutral-100 mb-1.5">{label}</label>} {/* Changed from text-sm, mb-1 to mb-1.5 */}
      <div className="relative">
        <select
          id={id}
          multiple={isMulti}
          value={selectValue}
          className={`${baseClasses} ${lightModeClasses} ${darkModeClasses} ${focusClasses} ${errorClasses} ${className}`}
          {...restProps}
        >
          {placeholder && !isMulti && (
            <option value="" disabled selected={selectValue === undefined || selectValue === ""}>
              {placeholder}
            </option>
          )}
          {selectOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {!isMulti && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500 dark:text-neutral-400"> {/* Chevron color for dark bg */}
            <ChevronDownIcon className="w-6 h-6" /> {/* Increased Chevron icon size */}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>} {/* Changed from text-xs */}
    </div>
  );
};

export default Select;