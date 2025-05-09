import '@testing-library/jest-dom';
import { vi } from 'vitest';
// import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import '@testing-library/jest-dom';


// Add testing-library matchers to vitest's expect
expect.extend(matchers);

// Mock matchMedia which is needed for shadcn/ui components
window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock CSS modules and style imports
vi.mock('*.css', () => ({}));

// Global mock for the fs module when used in React components
vi.mock('window.fs', () => ({
  readFile: vi.fn()
}));

// Reset all mocks after each test
// afterEach(() => {
//   cleanup();
// });