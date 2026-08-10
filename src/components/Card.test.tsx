import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { container } = render(<Card onClick={handleClick}>Clickable</Card>);
    fireEvent.click(container.firstChild as Element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has default cursor when no onClick provided', () => {
    const { container } = render(<Card>Static</Card>);
    expect((container.firstChild as HTMLElement).style.cursor).toBe('default');
  });

  it('has pointer cursor when onClick provided', () => {
    const { container } = render(<Card onClick={() => {}}>Clickable</Card>);
    expect((container.firstChild as HTMLElement).style.cursor).toBe('pointer');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="my-card">Content</Card>);
    expect(container.firstChild).toHaveClass('my-card');
  });
});
