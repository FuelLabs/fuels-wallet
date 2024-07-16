import React, { type ErrorInfo } from 'react';
import { Services, StoreProvider, store } from '~/store';
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

  async componentDidCatch(error: Error, info: ErrorInfo) {
    store.send(Services.reportError, {
      type: 'SAVE_ERROR',
      input: { ...error, ...info },
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

  onRestore = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <StoreProvider>
          <ReportErrors onRestore={this.onRestore} />
        </StoreProvider>
      );
    }
    return this.props.children;
  }
}

export function ReportErrorProvider({ children }: ErrorProviderProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
