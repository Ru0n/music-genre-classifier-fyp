import React from 'react';

/**
 * Button component with consistent styling across the application
 *
 * @param {Object} props - Component props
 * @param {'primary'|'secondary'|'accent'|'outline'|'ghost'|'link'|'gradient'} [props.variant='primary'] - Button style variant
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Button size
 * @param {boolean} [props.fullWidth=false] - Whether button should take full width
 * @param {boolean} [props.isLoading=false] - Whether button is in loading state
 * @param {boolean} [props.isDisabled=false] - Whether button is disabled
 * @param {boolean} [props.withIcon=false] - Whether button has an icon (adds spacing)
 * @param {boolean} [props.glow=false] - Whether to add glow effect on hover
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ButtonHTMLAttributes} props.rest - Any other button attributes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  isDisabled = false,
  withIcon = false,
  glow = false,
  children,
  className = '',
  ...rest
}) => {
  // Base classes for all button variants
  const baseClasses = "font-medium rounded-lg inline-flex items-center justify-center transition-all duration-200 focus:outline-none";

  // Variant-specific classes
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700",
    secondary: "bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary-500 dark:bg-secondary-600 dark:hover:bg-secondary-700",
    accent: "bg-accent-500 hover:bg-accent-600 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500 dark:bg-accent-600 dark:hover:bg-accent-700",
    outline: "border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
    link: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline-offset-4 hover:underline p-0 font-semibold",
    gradient: "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
  };

  // Size-specific classes
  const sizeClasses = {
    xs: "py-1 px-2 text-xs",
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-2.5 px-5 text-lg",
    xl: "py-3 px-6 text-xl"
  };

  // Icon spacing
  const iconSpacing = withIcon ? 'gap-2' : '';

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Glow effect
  const glowClass = glow ? 'hover:shadow-glow' : '';

  // Disabled state
  const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  // Loading state
  const loadingClass = isLoading ? 'relative !text-transparent' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${iconSpacing} ${widthClass} ${glowClass} ${disabledClass} ${loadingClass} ${className}`}
      disabled={isDisabled || isLoading}
      {...rest}
    >
      {children}

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </button>
  );
};

export default Button;
