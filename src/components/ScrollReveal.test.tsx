import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollReveal } from './ScrollReveal';

describe('ScrollReveal', () => {
  it('renders its children before the intersection fires', () => {
    render(
      <ScrollReveal>
        <p>Reveal me</p>
      </ScrollReveal>
    );
    expect(screen.getByText('Reveal me')).toBeInTheDocument();
  });

  it.each(['up', 'down', 'left', 'right'] as const)(
    'renders without crashing for direction=%s',
    (direction) => {
      render(
        <ScrollReveal direction={direction}>
          <span>content</span>
        </ScrollReveal>
      );
      expect(screen.getByText('content')).toBeInTheDocument();
    }
  );

  it('registers an IntersectionObserver on its wrapper element', () => {
    const observe = jest.fn();
    const originalIO = global.IntersectionObserver;
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: () => [],
      root: null,
      rootMargin: '',
      thresholds: [],
    })) as unknown as typeof IntersectionObserver;

    render(
      <ScrollReveal>
        <span>observed content</span>
      </ScrollReveal>
    );

    expect(observe).toHaveBeenCalledTimes(1);
    global.IntersectionObserver = originalIO;
  });
});
