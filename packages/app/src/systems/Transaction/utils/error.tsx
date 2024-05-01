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

export type VmErrorType = 'InsufficientInputAmount' | string;

export type InsufficientInputAmountError = {
  asset: string;
  expected: string;
  provided: string;
};

export type GroupedErrors = {
  InsufficientInputAmount: InsufficientInputAmountError;
  // biome-ignore lint/suspicious/noExplicitAny: allow any
  [key: VmErrorType]: Record<string, any> | string | unknown;
};

export const getGroupedErrors = (rawErrors?: { message: string }[]) => {
  if (!rawErrors) return undefined;

  const groupedErrors = rawErrors.reduce<GroupedErrors>(
    (prevGroupedError, rawError) => {
      const { message } = rawError;
      // in some case I had to add the Validity() to the regex. why?
      // const regex = /Validity\((\w+)\s+(\{.*\})\)/;
      const regex = /(\w+)\s+(\{.*\})/;

      const match = message.match(regex);
      if (match) {
        const errorType = match[1];
        const errorMessage = match[2];

        // biome-ignore lint/suspicious/noImplicitAnyLet: allow any
        let errorValue;
        try {
          const keyValuesMessage = errorMessage
            .replace('{ ', '')
            .replace(' }', '')
            .split(', ');
          const errorParsed = keyValuesMessage.reduce((prevError, keyValue) => {
            const [key, value] = keyValue.split(': ');

            return {
              // biome-ignore lint/performance/noAccumulatingSpread:
              ...prevError,
              [key]: key === 'asset' ? `0x${value}` : value,
            };
          }, {});
          errorValue = errorParsed;
        } catch (_) {
          errorValue = errorMessage;
        }

        return {
          // biome-ignore lint/performance/noAccumulatingSpread:
          ...prevGroupedError,
          [errorType]: errorValue,
        };
      }

      return prevGroupedError;
    },
    // biome-ignore lint/suspicious/noExplicitAny: allow any
    {} as any
  );

  return groupedErrors;
};
