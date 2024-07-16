import {
  BrowserClient,
  Scope,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
} from '@sentry/browser';
import { APP_VERSION, VITE_SENTRY_DSN } from '~/config';
import { db } from '~/systems/Core/utils/database';
import { parseFuelError } from '../utils';

const integrationsWithoutGlobalScope = getDefaultIntegrations({}).filter(
  (defaultIntegration) => {
    return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(
      defaultIntegration.name
    );
  }
);

/*
  @Description: This class is responsible for sending errors to Sentry.
  It must not be instantiated globally, or use global integrations (hence our integrations filter), 
  to avoid polluting the global scope with multiple instances of the Sentry client.
  For further information, please refer to Sentry docs on Shared Environments / Browser Extensions.
*/
export class ReportErrorService {
  client: BrowserClient;
  scope: Scope;

  constructor() {
    this.client = new BrowserClient({
      release: APP_VERSION,
      dsn: VITE_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      transport: makeFetchTransport,
      stackParser: defaultStackParser,
      integrations: integrationsWithoutGlobalScope,
    });

    this.scope = new Scope();

    this.scope.setClient(this.client);
    this.client.init();
  }
  async reportErrors() {
    const errors = await this.getErrors();

    for (const e of errors) {
      this.scope.captureException(e, {
        extra: e,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any);
    }
  }

  static saveError(error: Error) {
    return db.errors.add(parseFuelError(error));
  }

  async checkForErrors(): Promise<boolean> {
    const errors = await this.getErrors();
    return errors.length > 0;
  }

  async getErrors(): Promise<Error[]> {
    return db.errors.toArray() as Promise<Error[]>;
  }

  async clearErrors() {
    await db.errors.clear();
  }

  async dismissError(index: number) {
    const errors = await this.getErrors();
    if (index >= 0 && index < errors.length) {
      errors.splice(index, 1);
      await db.errors.clear();
      for (const error of errors) {
        await db.errors.add(error);
      }
    }
  }
}
