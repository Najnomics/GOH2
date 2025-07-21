import React from 'react';
import { motion } from 'framer-motion';
import classnames from 'classnames';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const classes = classnames(
    'bg-white rounded-2xl shadow-lg border border-gray-200',
    paddingSizes[padding],
    {
      'hover:shadow-xl transition-shadow duration-300': hover
    },
    className
  );

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component className={classes} {...motionProps} {...props}>
      {children}
    </Component>
  );
};

export default Card;