export type VMApiError = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  request: any;
  response: {
    errors: {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      locations: any;
      message: string;
      path: string[];
    }[];
  };
};

export type VmErrorType = 'InsufficientInputAmount';

export type InsufficientInputAmountError = {
  asset: string;
  expected: string;
  provided: string;
};

export type GroupedError = {
  errorMessage?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error?: InsufficientInputAmountError | any;
};

export type GroupedErrors = {
  [key: VmErrorType | string]: GroupedError[];
};

// typeguard
const isVmErrorTypeKey = <K extends string & keyof GroupedErrors>(
  properties: K[],
  vmError: string
): vmError is K => {
  return (properties as string[]).includes(vmError);
};

export const getGroupedErrors = (rawErrors?: { message: string }[]) => {
  if (!rawErrors) return undefined;

  const groupedErrors = rawErrors.reduce<GroupedErrors>(
    (prevGroupedError, rawError) => {
      const { message } = rawError;
      const [type, ...rest] = message.split(' ');
      const errorMessage = rest.join(' ').trim();

      if (isVmErrorTypeKey<VmErrorType>(['InsufficientInputAmount'], type)) {
        const keyValuesMessage = errorMessage
          .replace('{ ', '')
          .replace(' }', '')
          .split(', ');
        const error = keyValuesMessage.reduce((prevError, keyValue) => {
          const [key, value] = keyValue.split(': ');

          return {
            ...prevError,
            [key]: key === 'asset' ? `0x${value}` : value,
          };
        }, {});

        return {
          ...prevGroupedError,
          [type]: [
            ...(prevGroupedError[type] || []),
            {
              errorMessage: message,
              error: error as InsufficientInputAmountError,
            },
          ],
        };
      }

      return {
        ...prevGroupedError,
        [type]: [
          ...(prevGroupedError[type] || []),
          {
            errorMessage: message,
          },
        ],
      };
    },
    {}
  );

  return groupedErrors;
};

export const getFilteredErrors = (
  groupedErrors?: GroupedErrors,
  filterOutKeys?: Array<VmErrorType | string>
) => {
  if (!groupedErrors) return undefined;
  if (!filterOutKeys) return groupedErrors;

  const filteredErrors = Object.keys(groupedErrors).reduce<GroupedErrors>(
    (prevGroupedErrors, key) => {
      if (!filterOutKeys.includes(key)) {
        return {
          ...prevGroupedErrors,
          [key]: groupedErrors[key],
        };
      }

      return prevGroupedErrors;
    },
    {}
  );

  return Object.keys(filteredErrors).length > 0 ? filteredErrors : undefined;
};
