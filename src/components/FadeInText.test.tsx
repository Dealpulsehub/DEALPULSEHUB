import React from 'react';
import { render } from '@testing-library/react';
import { FadeInText } from './FadeInText';

describe('FadeInText', () => {
  it('renders the full text', () => {
    const { container } = render(<FadeInText text="Hello world" />);
    expect(container.textContent?.trim()).toBe('Hello world');
  });

  it('splits text into one span per word', () => {
    const { container } = render(<FadeInText text="One two three" />);
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(3);
    expect(spans[0]).toHaveTextContent('One');
    expect(spans[1]).toHaveTextContent('two');
    expect(spans[2]).toHaveTextContent('three');
  });

  it.each(['sm', 'md', 'lg', 'xl'] as const)('renders %s size without crashing', (size) => {
    const { container } = render(<FadeInText text="Sized text" size={size} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with default size when none is provided', () => {
    const { container } = render(<FadeInText text="Default size" />);
    expect(container.firstChild).toHaveStyle({ fontSize: '20px' });
  });
});
