import React from 'react';
import { colors, spacing, borderRadius, typography } from '../tokens/tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[700],
    },
    success: {
      backgroundColor: colors.semantic.success,
      color: colors.neutral[0],
    },
    warning: {
      backgroundColor: colors.semantic.warning,
      color: colors.neutral[0],
    },
    error: {
      backgroundColor: colors.semantic.error,
      color: colors.neutral[0],
    },
  };

  const style: React.CSSProperties = {
    ...variantStyles[variant],
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    display: 'inline-block',
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};
