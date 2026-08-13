import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedHero } from './AnimatedHero';

describe('AnimatedHero', () => {
  it('renders title and subtitle', () => {
    render(<AnimatedHero title="Grow faster" subtitle="Ship your funnel this week" />);
    expect(screen.getByText('Grow faster')).toBeInTheDocument();
    expect(screen.getByText('Ship your funnel this week')).toBeInTheDocument();
  });

  it('does not render an image when none is provided', () => {
    render(<AnimatedHero title="Title" subtitle="Subtitle" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the image with alt text matching the title', () => {
    render(<AnimatedHero title="Title" subtitle="Subtitle" image="/hero.png" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/hero.png');
    expect(img).toHaveAttribute('alt', 'Title');
  });

  it('does not render a CTA button when none is provided', () => {
    render(<AnimatedHero title="Title" subtitle="Subtitle" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the CTA and calls its onClick handler', () => {
    const handleClick = jest.fn();
    render(
      <AnimatedHero
        title="Title"
        subtitle="Subtitle"
        cta={{ text: 'Get started', onClick: handleClick }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
