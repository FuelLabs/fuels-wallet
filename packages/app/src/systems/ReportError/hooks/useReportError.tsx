export function useReportError() {
  const reportErrorsOnce = () => {
    console.log('reportErrorsOnce');
  };

  const alwaysReportErrors = () => {
    console.log('alwaysReportErrors');
  };

  const dontReportErrors = () => {
    console.log('dontReportErrors');
  };

  const close = () => {
    console.log('close');
  };

  return {
    handlers: {
      reportErrorsOnce,
      alwaysReportErrors,
      dontReportErrors,
      close,
    },
    state: {},
  };
}
