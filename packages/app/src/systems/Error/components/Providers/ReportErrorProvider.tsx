/* eslint-disable no-console */

import React from 'react';
import { IS_DEVELOPMENT } from '~/config';

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
    if (IS_DEVELOPMENT) {
      console.error(error);
      console.error(reactError);
    }
    // await ReportErrorService.saveError({
    //   error,
    //   reactError: reactError as any,
    // });
    // this.setState({
    //   hasError: true,
    // });
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
