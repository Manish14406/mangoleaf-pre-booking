import React from 'react';

export default function Input({ 
  label, 
  error,
  id,
  type = 'text',
  className = '', 
  icon: Icon,
  ...props 
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />}
        <input 
          id={id}
          type={type}
          className="form-input"
          style={Icon ? { paddingLeft: '2.5rem' } : {}}
          {...props}
        />
      </div>
      {error && <span className="error-message">⚠ {error}</span>}
    </div>
  );
}
