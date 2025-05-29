// Browser environment setup for js-crypto-random
// This file sets up the browser environment for testing

// Ensure crypto API is available (modern browsers have this by default)
if (typeof globalThis.crypto === 'undefined') {
  console.warn('WebCrypto API not available in test environment');
}

// Set up any global test utilities if needed
(globalThis as any).TEST_ENV = 'browser';

// Make this file a module
export {};
