import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input placeholder="test" onChange={handleChange} />);
    fireEvent.change(screen.getByPlaceholderText('test'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input placeholder="test" disabled />);
    expect(screen.getByPlaceholderText('test')).toBeDisabled();
  });

  it.each(['text', 'email', 'password', 'number'] as const)('renders %s type correctly', (type) => {
    render(<Input placeholder={`input-${type}`} type={type} />);
    expect(screen.getByPlaceholderText(`input-${type}`)).toHaveAttribute('type', type);
  });

  it('reflects controlled value', () => {
    render(<Input placeholder="test" value="hello" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('test')).toHaveValue('hello');
  });
});
