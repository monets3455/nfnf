
import React from 'react';
// import { ACCENT_COLOR } from '../../constants'; // No longer needed here directly if classes are static

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-dark flex items-center justify-center transition-colors duration-150';
  
  // Increased padding and font sizes
  const sizeStyles = {
    sm: 'px-3.5 py-2 text-sm',      // Was: px-3 py-1.5 text-sm. Adjusted text to sm (0.9rem)
    md: 'px-5 py-2.5 text-base',    // Was: px-4 py-2 text-base. Adjusted text to base (1.05rem)
    lg: 'px-7 py-3 text-lg',        // Was: px-6 py-3 text-lg. Adjusted text to lg (1.2rem)
  };

  // Note: ACCENT_COLOR is 'brand-teal'
  // Updated to use static class names
  const variantStyles = {
    primary: `bg-brand-teal text-black hover:bg-opacity-90 focus:ring-brand-teal`,
    secondary: `bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:ring-brand-teal`,
    outline: `border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-black focus:ring-brand-teal`,
    ghost: `text-brand-teal hover:bg-brand-teal hover:bg-opacity-10 dark:hover:bg-opacity-20 focus:ring-brand-teal`,
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;