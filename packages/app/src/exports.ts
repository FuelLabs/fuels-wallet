import { IS_DEVELOPMENT, IS_TEST } from './config';
import { db } from './systems/Core/utils/database';

// On development or test env
// expose fueldb on window
// To enable database manipulation
//
// Vite removes this code on production build
if (IS_DEVELOPMENT || IS_TEST) {
  if (typeof window === 'object') {
    window.fuelDB = db;
    window.testCrash = () => {
      window.dispatchEvent(new Event('crashReact'));
    };
  }
}

declare global {
  interface Window {
    fuelDB: typeof db;
    testCrash: () => void;
  }
}
