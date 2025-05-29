// Browser environment setup for js-x509-utils
// This file sets up the browser environment for testing

import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
(globalThis as any).Buffer = Buffer;

// Ensure crypto API is available (modern browsers have this by default)
if (typeof globalThis.crypto === 'undefined') {
  console.warn('WebCrypto API not available in test environment');
}

// Set up any global test utilities if needed
(globalThis as any).TEST_ENV = 'browser';

// Make this file a module
export {};
