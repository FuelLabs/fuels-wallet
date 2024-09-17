import { ErrorCode, type FuelError } from 'fuels';

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

export type InsufficientInputAmountError = {
  asset: string;
  expected: string;
  provided: string;
};

export type GroupedErrors = string | undefined;

const camelCaseToHuman = (message: string): string => {
  return message.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const getErrorMessage = (
  error: FuelError | undefined
): GroupedErrors => {
  if (!error) return undefined;

  // FuelCore error with Validity()
  // Example: Validity(TransactionMaxGasExceeded)
  if (error.message.startsWith('Validity(')) {
    const validity = error.message.match(/\((\w+)\)/);
    if (validity) {
      return camelCaseToHuman(validity[1]);
    }
  }

  // FuelCore error with object
  // Example: InsufficientMaxFee { max_fee_from_policies: 0, max_fee_from_gas_price: 571 }
  const withObject = /^([a-zA-Z]+)(?:\s*\{(.+)\})?$/;
  const match = error.message.match(withObject);
  if (match) {
    return `${camelCaseToHuman(match[1])} { ${match[2]} }`;
  }

  return error.message;
};
