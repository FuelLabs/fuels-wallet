import React from 'react';

import { ReportErrors } from '../../pages';
import { ReportErrorService } from '../../services';
import { parseFuelError } from '../../utils';

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

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const fuelError = parseFuelError({ ...error, ...errorInfo });
    await ReportErrorService.saveError(fuelError);
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ReportErrors />;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
