import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'ghost' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ];

  const variantClasses = {
    primary: [
      'bg-primary-pink text-white hover:bg-primary-pink-hover',
      'focus:ring-primary-pink shadow-sm',
    ],
    secondary: [
      'bg-gray-100 text-gray-900 hover:bg-gray-200',
      'focus:ring-gray-500',
    ],
    gradient: [
      'bg-gradient-to-r from-primary-pink to-primary-purple text-white',
      'hover:from-primary-pink-hover hover:to-primary-purple-hover',
      'focus:ring-primary-pink shadow-lg',
    ],
    outline: [
      'border-2 border-primary-pink text-primary-pink bg-transparent',
      'hover:bg-primary-pink hover:text-white',
      'focus:ring-primary-pink',
    ],
    ghost: [
      'text-gray-700 hover:bg-gray-100',
      'focus:ring-gray-500',
    ],
    disabled: [
      'bg-gray-200 text-gray-400 cursor-not-allowed',
    ],
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = classNames(
    baseClasses,
    variantClasses[disabled || loading ? 'disabled' : variant],
    sizeClasses[size],
    widthClasses,
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
      )}
      {children}
    </button>
  );
};