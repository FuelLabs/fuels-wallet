import React from 'react';
import { Services, store } from '~/store';
import { ReportErrors } from '../../pages';

type ErrorProviderProps = {
  children: React.ReactNode;
};

export class ErrorBoundary extends React.Component<
  ErrorProviderProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  async componentDidCatch(error: Error, reactError: React.ErrorInfo) {
    store.send(Services.reportError, {
      type: 'SAVE_ERROR',
      input: { error, reactError },
    });
    this.setState({
      hasError: true,
    });
  }

  async componentDidMount() {
    this.checkErrors();
  }

  checkErrors = async () => {
    store.send(Services.reportError, { type: 'CHECK_FOR_ERRORS' });
  };

  render() {
    if (this.state.hasError) {
      return <ReportErrors />;
    }
    return this.props.children;
  }
}

export function ReportErrorProvider({ children }: ErrorProviderProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
