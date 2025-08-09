import '@testing-library/jest-dom';

// @ts-expect-error
global.IntersectionObserver = class {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};