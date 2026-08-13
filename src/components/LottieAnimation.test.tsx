import React from 'react';
import { render, screen } from '@testing-library/react';
import { LottieAnimation } from './LottieAnimation';

// lottie-react drives lottie-web's canvas/SVG renderer, which jsdom doesn't
// implement well enough to animate reliably in a test environment. We mock
// it to a plain stub so we can test LottieAnimation's own prop wiring
// (dimensions, loop/autoplay passthrough, speed control via lottieRef)
// without depending on real animation playback.
const setSpeed = jest.fn();

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: jest.fn(({ animationData, loop, autoplay, style, lottieRef }) => {
    if (lottieRef) {
      lottieRef.current = { setSpeed };
    }
    return (
      <div
        data-testid="lottie-stub"
        data-loop={String(loop)}
        data-autoplay={String(autoplay)}
        data-has-animation={String(animationData != null)}
        style={style}
      />
    );
  }),
}));

const sampleAnimationData = { v: '5.7.0', layers: [] };

describe('LottieAnimation', () => {
  beforeEach(() => {
    setSpeed.mockClear();
  });

  it('renders the Lottie player with the given animation data', () => {
    render(<LottieAnimation animationData={sampleAnimationData} />);
    const stub = screen.getByTestId('lottie-stub');
    expect(stub).toHaveAttribute('data-has-animation', 'true');
  });

  it('defaults to loop and autoplay enabled', () => {
    render(<LottieAnimation animationData={sampleAnimationData} />);
    const stub = screen.getByTestId('lottie-stub');
    expect(stub).toHaveAttribute('data-loop', 'true');
    expect(stub).toHaveAttribute('data-autoplay', 'true');
  });

  it('forwards loop=false and autoplay=false', () => {
    render(<LottieAnimation animationData={sampleAnimationData} loop={false} autoplay={false} />);
    const stub = screen.getByTestId('lottie-stub');
    expect(stub).toHaveAttribute('data-loop', 'false');
    expect(stub).toHaveAttribute('data-autoplay', 'false');
  });

  it('applies custom width and height', () => {
    render(<LottieAnimation animationData={sampleAnimationData} width={120} height={80} />);
    const stub = screen.getByTestId('lottie-stub');
    expect(stub).toHaveStyle({ width: '120px', height: '80px' });
  });

  it('applies the requested speed to the player via lottieRef', () => {
    render(<LottieAnimation animationData={sampleAnimationData} speed={2} />);
    expect(setSpeed).toHaveBeenCalledWith(2);
  });
});
