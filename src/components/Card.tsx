import React from 'react';
import { borderRadius, shadows, spacing } from '../tokens/tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const style: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    padding: spacing.lg,
    transition: 'all 0.3s ease-in-out',
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div style={style} className={className} onClick={onClick}>
      {children}
    </div>
  );
};
