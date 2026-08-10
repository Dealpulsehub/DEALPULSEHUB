import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heading1, Heading2, Paragraph } from './Typography';

describe('Typography', () => {
  it('Heading1 renders as an h1 with correct text', () => {
    render(<Heading1>Main Title</Heading1>);
    expect(screen.getByRole('heading', { level: 1, name: 'Main Title' })).toBeInTheDocument();
  });

  it('Heading2 renders as an h2 with correct text', () => {
    render(<Heading2>Subtitle</Heading2>);
    expect(screen.getByRole('heading', { level: 2, name: 'Subtitle' })).toBeInTheDocument();
  });

  it('Paragraph renders text content', () => {
    render(<Paragraph>Body text</Paragraph>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });
});
