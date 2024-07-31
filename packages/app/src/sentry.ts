import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { APP_VERSION, VITE_SENTRY_DSN } from '~/config';

Sentry.init({
  dsn: VITE_SENTRY_DSN,
  release: APP_VERSION,
  environment: process.env.NODE_ENV,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
});
