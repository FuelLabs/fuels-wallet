import React, { type ErrorInfo } from 'react';
import { IS_CRX_POPUP } from '~/config';
import { Services, StoreProvider, store } from '~/store';
import { ReportErrorService } from '~/systems/Error/services';
import { ReportErrors } from '../../pages';

type ErrorProviderProps = {
  children: React.ReactNode;
};

export class ErrorBoundary extends React.Component<
  ErrorProviderProps,
  { hasError: boolean }
> {
  state = { hasError: false };
  // This Component is shared with the WelcomeScreen, the machines' store is not meant to initialize outside the PopUp
  shouldNotTriggerStore = !IS_CRX_POPUP;

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  async componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({
      hasError: true,
    });
    if (this.shouldNotTriggerStore) {
      ReportErrorService.saveError(error);
      return;
    }
    store.send(Services.reportError, {
      type: 'SAVE_ERROR',
      input: { ...error, ...info },
    });
    return;
  }

  async componentDidMount() {
    if (this.shouldNotTriggerStore) {
      return;
    }
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
          <ReportErrors onRestore={this.onRestore} errorBoundary />
        </StoreProvider>
      );
    }
    return this.props.children;
  }
}

export function ReportErrorProvider({ children }: ErrorProviderProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
