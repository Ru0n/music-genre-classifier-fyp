import React from 'react';

/**
 * Card component with consistent styling across the application
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {'default'|'glass'|'gradient'|'outline'} [props.variant='default'] - Card style variant
 * @param {boolean} [props.hover=false] - Whether to apply hover effects
 * @param {React.HTMLAttributes} props.rest - Any other HTML attributes
 */
const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  ...rest
}) => {
  // Base classes for all card variants
  const baseClasses = "p-6 rounded-xl transition-all duration-300";

  // Variant-specific classes
  const variantClasses = {
    default: "bg-white dark:bg-gray-800 shadow-soft",
    glass: "glass backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 shadow-soft",
    gradient: "bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-soft",
    outline: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
  };

  // Hover effect classes
  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-lg" : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
