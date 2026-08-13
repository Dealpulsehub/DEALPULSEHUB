import React from 'react';
import { render, screen } from '@testing-library/react';
import { ParallaxSection } from './ParallaxSection';

describe('ParallaxSection', () => {
  it('renders its children', () => {
    render(
      <ParallaxSection>
        <p>Inside the section</p>
      </ParallaxSection>
    );
    expect(screen.getByText('Inside the section')).toBeInTheDocument();
  });

  it('applies a custom background when provided', () => {
    const { container } = render(
      <ParallaxSection background="#123456">
        <span>content</span>
      </ParallaxSection>
    );
    expect(container.firstChild).toHaveStyle({ background: '#123456' });
  });

  it('renders without crashing when speed is customized', () => {
    render(
      <ParallaxSection speed={1.5}>
        <span>fast parallax</span>
      </ParallaxSection>
    );
    expect(screen.getByText('fast parallax')).toBeInTheDocument();
  });
});
