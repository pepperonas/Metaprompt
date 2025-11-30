import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-bg-secondary rounded-xl p-6 shadow-lg border border-bg-primary transition-all duration-200 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-text-primary mb-5">{title}</h3>
      )}
      {children}
    </div>
  );
};

