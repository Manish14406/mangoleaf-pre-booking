import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  ...props 
}) {
  return (
    <div 
      className={`glass-panel animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
