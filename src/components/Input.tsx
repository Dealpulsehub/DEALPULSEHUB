import React from 'react';
import { colors, spacing, borderRadius, typography } from '../tokens/tokens';

interface InputProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const style: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral[300]}`,
    backgroundColor: disabled ? colors.neutral[100] : colors.neutral[0],
    color: colors.neutral[900],
    transition: 'border-color 0.2s',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.5 : 1,
    width: '100%',
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={style}
      className={className}
    />
  );
};
