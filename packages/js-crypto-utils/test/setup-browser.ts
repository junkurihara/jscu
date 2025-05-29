// Browser environment setup for crypto utilities
// This file sets up the browser environment for testing crypto operations

// Ensure crypto API is available (modern browsers have this by default)
if (typeof globalThis.crypto === 'undefined') {
  // In test environment, this should not happen with modern browsers
  console.warn('WebCrypto API not available in test environment');
}

// Set up any global test utilities if needed
(globalThis as any).TEST_ENV = 'browser';

// Make this file a module
export {};
