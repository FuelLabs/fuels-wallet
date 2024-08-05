import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { APP_VERSION, IS_CRX_POPUP, VITE_SENTRY_DSN } from '~/config';

if (IS_CRX_POPUP) {
  console.log('Sentry enabled');

  Sentry.init({
    dsn: VITE_SENTRY_DSN,
    release: APP_VERSION,
    environment: process.env.NODE_ENV,
    integrations: (integrations) => {
      // integrations will be all default integrations
      const filteredIntegrations = integrations.filter((integration) => {
        return integration.name !== 'Dedupe';
      });

      filteredIntegrations.push(
        Sentry.reactRouterV6BrowserTracingIntegration({
          useEffect: useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        })
      );

      return filteredIntegrations;
    },
    tracesSampleRate: 1.0, // debug: true,
    enabled: true,
    debug: true,
  });
}
