import React from 'react';
import { colors, spacing, borderRadius } from '../tokens/tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  className = '',
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.neutral[0],
      border: `1px solid ${colors.primary[500]}`,
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '14px',
    },
    md: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: '16px',
    },
    lg: {
      padding: `${spacing.lg} ${spacing.xl}`,
      fontSize: '18px',
    },
  };

  const style: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: borderRadius.md,
    transition: 'all 0.2s ease-in-out',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
};
