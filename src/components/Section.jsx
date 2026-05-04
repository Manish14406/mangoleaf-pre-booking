import React from 'react';

export default function Section({ 
  children, 
  title,
  subtitle,
  className = '', 
  ...props 
}) {
  return (
    <section className={`mb-8 ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && <h2 className="mb-2">{title}</h2>}
          {subtitle && <p className="text-secondary">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
