import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver. Components that rely on it
// for scroll-triggered reveals (react-intersection-observer) need a stub so
// they render instead of throwing "IntersectionObserver is not defined".
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
