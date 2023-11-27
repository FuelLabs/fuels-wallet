import React from 'react';

import { ReportErrors } from '../../pages';
import { ReportErrorService } from '../../services';

type ErrorProviderProps = {
  children: React.ReactNode;
};

class ErrorBoundary extends React.Component<
  ErrorProviderProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  async componentDidCatch(error: Error, reactError: React.ErrorInfo) {
    await ReportErrorService.saveError({
      error,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reactError: reactError as any,
    });
    this.setState({
      hasError: true,
    });
  }

  async componentDidMount() {
    this.checkErrors();
  }

  checkErrors = async () => {
    const errors = await ReportErrorService.getErrors();
    if (errors.length > 0) {
      this.setState({
        hasError: true,
      });
    }
  };

  render() {
    if (this.state.hasError) {
      return <ReportErrors />;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
