import { localStorageMock } from './src/__mocks__/localStorageMock';

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// If test fails retry it until success
jest.retryTimes(3, {
  logErrorsBeforeRetry: true,
});
