import { createUUID } from '@fuel-wallet/sdk';
import React, { createContext, useEffect } from 'react';

import { db } from '../Core';

const initialState = {};

const FuelErrorContext = createContext(initialState);
const { Provider } = FuelErrorContext;

type ErrorProviderProps = {
  children: React.ReactNode;
};

const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const handleError = async (e: ErrorEvent) => {
    const error = {
      id: createUUID(),
      message: e.message,
      stack: e.error?.stack,
      timestamp: new Date().getTime(),
      name: e.error?.name,
    };
    await db.errors.add(error);
    // return false to allow the default handler to run.
    return false;
  };

  const handleUnhandledRejection = async (e: PromiseRejectionEvent) => {
    e.preventDefault();
    const error = {
      id: createUUID(),
      message: e.reason.message,
      stack: e.reason?.stack,
      timestamp: new Date().getTime(),
      name: e.reason?.name,
    };
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
