import React from 'react';
import { colors, typography } from '../tokens/tokens';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading1: React.FC<TypographyProps> = ({ children, className }) => (
  <h1
    style={{
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral[900],
    }}
    className={className}
  >
    {children}
  </h1>
);

export const Heading2: React.FC<TypographyProps> = ({ children, className }) => (
  <h2
    style={{
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral[900],
    }}
    className={className}
  >
    {children}
  </h2>
);

export const Paragraph: React.FC<TypographyProps> = ({ children, className }) => (
  <p
    style={{
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.regular,
      color: colors.neutral[700],
      lineHeight: '1.6',
    }}
    className={className}
  >
    {children}
  </p>
);
