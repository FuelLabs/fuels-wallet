type IgnoredError = {
  value: string;
  field: 'message' | 'stack' | 'name';
  comparison: 'exact' | 'partial' | 'startsWith';
  /**
   * @description Whether to ignore the error or hide it from Report Error screen. Avoid ignoring errors that might contain sensitive information.
   */
  action: 'ignore' | 'hide';
};

export function getErrorIgnoreData(
  error: Error | undefined
): IgnoredError | undefined {
  return IGNORED_ERRORS.find((filter) => {
    const errorValue = error?.[filter.field] as string | undefined;

    switch (filter.comparison) {
      case 'exact':
        return filter.value === errorValue;
      case 'startsWith':
        return errorValue?.startsWith(filter.value);
      case 'partial':
        return errorValue?.includes(filter.value);
    }
  });
}

const IGNORED_ERRORS: IgnoredError[] = [
  {
    value: 'Out of sync',
    field: 'message',
    comparison: 'exact',
    action: 'hide',
  },
  {
    value: 'Failed to fetch',
    field: 'message',
    comparison: 'exact',
    action: 'hide',
  },
  {
    value: 'TypeError:',
    field: 'stack',
    comparison: 'startsWith',
    action: 'ignore',
  },
  {
    value: 'NotFoundError',
    field: 'name',
    comparison: 'exact',
    action: 'hide',
  },
  {
    value: 'The browser is shutting down.',
    field: 'message',
    comparison: 'partial',
    action: 'hide',
  },
  {
    value: 'Error fetching asset from db',
    field: 'message',
    comparison: 'partial',
    action: 'hide',
  },
  {
    value: 'Cannot read properties of undefined',
    field: 'message',
    comparison: 'partial',
    action: 'hide',
  },
  {
    value: 'Params are required',
    field: 'message',
    comparison: 'partial',
    action: 'hide',
  },
];
