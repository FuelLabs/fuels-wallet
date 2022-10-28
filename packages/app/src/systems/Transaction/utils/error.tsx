export type VmErrorType = 'InsufficientInputAmount';
export type InsufficientInputAmountError = {
  asset: string;
  expected: string;
  provided: string;
};

export type GroupedError = {
  [key: string]: any;
  InsufficientInputAmount?: InsufficientInputAmountError[];
};

// typeguard
const isVmErrorTypeKey = <K extends string & keyof GroupedError>(
  properties: K[],
  vmError: string
): vmError is K => {
  return (properties as string[]).includes(vmError);
};

export const getGroupedErrors = (rawErrors?: { message: string }[]) => {
  if (!rawErrors) return undefined;

  const groupedErrors = rawErrors.reduce<GroupedError>(
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
            error as InsufficientInputAmountError,
          ],
        };
      }

      return {
        ...prevGroupedError,
        [type]: [...(prevGroupedError[type] || []), errorMessage],
      };
    },
    {}
  );

  return groupedErrors;
};
