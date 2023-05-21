import React, { createContext, useEffect } from 'react';

import { db } from '../../../Core';
import { errorToFuelError } from '../../utils';

const initialState = {};

const FuelErrorContext = createContext(initialState);
const { Provider } = FuelErrorContext;

type ErrorProviderProps = {
  children: React.ReactNode;
};

const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const handleError = async (e: ErrorEvent) => {
    const error = errorToFuelError(e);
    await db.errors.add(error);
    // return false to allow the default handler to run.
    return false;
  };

  const handleUnhandledRejection = async (e: PromiseRejectionEvent) => {
    e.preventDefault();
    const error = errorToFuelError(e);
    await db.errors.add(error);
    // return false to allow the default handler to run.
    return true;
  };

  useEffect(() => {
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  return <Provider value={{}}>{children}</Provider>;
};

export { FuelErrorContext, ErrorProvider };
