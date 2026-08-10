import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it.each(['primary', 'success', 'warning', 'error'] as const)('renders %s variant without crashing', (variant) => {
    render(<Badge variant={variant}>Label</Badge>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Label</Badge>);
    expect(screen.getByText('Label')).toHaveClass('custom-badge');
  });
});
