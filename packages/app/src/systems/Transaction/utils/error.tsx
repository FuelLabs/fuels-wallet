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

export type InsufficientMaxFeeDetails = {
  maxFeeFromPolicies?: number;
  maxFeeFromGasPrice?: number;
};

export type StructuredError = {
  message: string;
  isInsufficientMaxFee?: boolean;
  details?: InsufficientMaxFeeDetails;
};

export type GroupedErrors = string | StructuredError | undefined;

const camelCaseToHuman = (message: string): string => {
  return message.replace(/([a-z])([A-Z])/g, '$1 $2');
};

const parseInsufficientMaxFeeError = (
  message: string
): InsufficientMaxFeeDetails | null => {
  // Match: "InsufficientMaxFee { max_fee_from_policies: 0, max_fee_from_gas_price: 571 }"
  const match = message.match(
    /max_fee_from_policies:\s*(\d+).*max_fee_from_gas_price:\s*(\d+)/
  );
  if (match) {
    return {
      maxFeeFromPolicies: Number.parseInt(match[1], 10),
      maxFeeFromGasPrice: Number.parseInt(match[2], 10),
    };
  }
  return null;
};

export const getErrorMessage = (
  error: FuelError | undefined
): GroupedErrors => {
  if (!error) return undefined;

  let message = '';

  // FuelCore error with Validity()
  // Example: Validity(TransactionMaxGasExceeded)
  if (error.message.startsWith('Validity(')) {
    const validity = error.message.match(/\((\w+)\)/);
    if (validity) {
      message = camelCaseToHuman(validity[1]);
    } else {
      message = error.message;
    }
  } else {
    // FuelCore error with object
    // Example: InsufficientMaxFee { max_fee_from_policies: 0, max_fee_from_gas_price: 571 }
    const withObject = /^([a-zA-Z]+)(?:\s*\{(.+)\})?$/;
    const match = error.message.match(withObject);
    if (match) {
      message = `${camelCaseToHuman(match[1])} { ${match[2]} }`;
    } else {
      message = error.message;
    }
  }

  // Check if this is an InsufficientMaxFee error
  const isInsufficientMaxFee = error.message.includes('InsufficientMaxFee');
  const details = isInsufficientMaxFee
    ? parseInsufficientMaxFeeError(error.message)
    : undefined;

  // Return structured error if we have additional metadata
  if (isInsufficientMaxFee || details) {
    return {
      message,
      isInsufficientMaxFee,
      details: details || undefined,
    };
  }

  // Return plain string for backward compatibility
  return message;
};

/**
 * Detect InsufficientMaxFee from any error shape (VMApiError, FuelError, string, etc.)
 * Used primarily for send/submission errors (txApproveError) which can be various types.
 */
export const detectInsufficientMaxFee = (
  error: VMApiError | string | undefined | null
): StructuredError | null => {
  if (!error) return null;

  // Try to find InsufficientMaxFee in any string property of the error
  const errorStr = typeof error === 'string' ? error : JSON.stringify(error);

  if (!errorStr?.includes('InsufficientMaxFee')) return null;

  const details = parseInsufficientMaxFeeError(errorStr);
  return {
    message: errorStr,
    isInsufficientMaxFee: true,
    details: details || undefined,
  };
};
