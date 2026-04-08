import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
window.scrollTo = (() => {}) as typeof window.scrollTo;

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup();
});
