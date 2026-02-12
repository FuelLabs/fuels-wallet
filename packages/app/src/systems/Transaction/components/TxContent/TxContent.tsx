import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Card,
  ContentLoader,
  Copyable,
  Icon,
  Text,
} from '@fuel-ui/react';
import type {
  BN,
  TransactionRequest,
  TransactionStatus,
  TransactionSummary,
} from 'fuels';
import { bn } from 'fuels';
import { type ReactNode, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAccounts } from '~/systems/Account';
import { type Maybe, MotionStack, animations } from '~/systems/Core';
import type { SendFormValues } from '~/systems/Send/hooks';
import {
  type GroupedErrors,
  getGasLimitFromTxRequest,
} from '~/systems/Transaction';
import { useSimplifiedTransaction } from '../../hooks/useSimplifiedTransaction';
import { TxFee } from '../TxFee';
import { TxFeeSection } from '../TxFee/TxFeeSection';
import { TxFeeOptions } from '../TxFeeOptions/TxFeeOptions';
import { TxHeader } from '../TxHeader';
import { TxOperations } from '../TxOperations';

const ErrorHeader = ({
  errors,
  suggestedMinFee,
}: { errors?: GroupedErrors; suggestedMinFee?: BN }) => {
  // Handle structured error format
  const isStructuredError = typeof errors === 'object' && errors !== null;
  const isInsufficientMaxFee = isStructuredError && errors.isInsufficientMaxFee;
  const errorMessage = isStructuredError ? errors.message : errors;

  return (
    <Alert
      status={isInsufficientMaxFee ? 'warning' : 'error'}
      css={styles.alert}
      aria-label="Transaction Error"
    >
      <Copyable
        value={errorMessage ?? ''}
        aria-label={errorMessage}
        iconProps={{
          icon: Icon.is('Copy'),
          'aria-label': 'Copy Error',
        }}
        tooltipMessage="Copy Error"
      >
        <Alert.Description
          as="div"
          css={{
            wordBreak: 'break-word',
          }}
        >
          {isInsufficientMaxFee ? (
            <>
              Gas price increased since estimation. Please increase your fee and
              try again.
              {suggestedMinFee && (
                <Text fontSize="sm" css={{ display: 'block', mt: '$2' }}>
                  Minimum required fee: {suggestedMinFee.format()} ETH
                </Text>
              )}
            </>
          ) : (
            errorMessage
          )}
        </Alert.Description>
      </Copyable>
    </Alert>
  );
};

const LoaderHeader = () => (
  <Card css={{ height: 84 }}>
    <ContentLoader width={'100%'} height={'100%'} viewBox="0 0 300 84">
      <rect x="16" y="15" width="15" height="15" rx="4" />
      <rect x="80" y="15" width="130" height="15" rx="4" />

      <rect x="16" y="35" width="55" height="15" rx="4" />
      <rect x="80" y="35" width="90" height="15" rx="4" />

      <rect x="16" y="55" width="35" height="15" rx="4" />
      <rect x="80" y="55" width="60" height="15" rx="4" />
    </ContentLoader>
  </Card>
);

type TxContentLoaderProps = {
  showHeaderLoader?: boolean;
};

function TxContentLoader({ showHeaderLoader = true }: TxContentLoaderProps) {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4">
      {showHeaderLoader && <LoaderHeader />}
      <TxOperations.Loader />
      <TxFeeSection isLoading />
    </MotionStack>
  );
}

export type TxContentInfoProps = {
  footer?: ReactNode;
  tx?: TransactionSummary;
  txStatus?: Maybe<TransactionStatus>;
  showDetails?: boolean;
  errors?: GroupedErrors;
  fees?: {
    baseFee?: BN;
    regularTip?: BN;
    fastTip?: BN;
  };
  txRequest?: TransactionRequest;
  isLoadingFees?: boolean;
  isLoading?: boolean;
  txAccount?: string;
  isSimulating?: boolean;
  isPastTense?: boolean;
  signOnly?: boolean;
  suggestedMinFee?: BN;
  autoAdvanced?: boolean;
};

function TxContentInfo({
  tx,
  txStatus,
  footer,
  showDetails,
  errors,
  fees,
  txRequest,
  isLoadingFees,
  isLoading,
  txAccount,
  isSimulating,
  isPastTense = false,
  signOnly = false,
  suggestedMinFee,
  autoAdvanced = false,
}: TxContentInfoProps) {
  const { account: currentAccount } = useAccounts();
  const formContext = useFormContext<SendFormValues>();
  const { getValues } = formContext || {};
  const status = txStatus || tx?.status || txStatus;
  const hasErrors = Boolean(
    typeof errors === 'string'
      ? errors
      : errors && typeof errors === 'object'
        ? errors.message
        : false
  );
  const isExecuted = !!tx?.id && status; // Added status check to ensure the tx is executed, as TX.id is now always present.
  const txRequestGasLimit = getGasLimitFromTxRequest(txRequest);

  const account = txAccount || currentAccount?.address;

  const { transaction } = useSimplifiedTransaction({
    tx,
    txRequest,
    txAccount: account,
  });

  const initialAdvanced = useMemo(() => {
    if (!fees?.regularTip || !fees?.fastTip) return false;

    try {
      const tipAmount = getValues?.('fees.tip.amount');
      const gasLimitAmount = getValues?.('fees.gasLimit.amount');
      if (!tipAmount || !gasLimitAmount) return false;

      const isFeeAmountTheRegularTip = tipAmount.eq(fees.regularTip);
      const isFeeAmountTheFastTip = tipAmount.eq(fees.fastTip);
      const isGasLimitTheTxRequestGasLimit =
        gasLimitAmount.eq(txRequestGasLimit);

      return (
        (!isFeeAmountTheRegularTip && !isFeeAmountTheFastTip) ||
        !isGasLimitTheTxRequestGasLimit
      );
    } catch (_) {
      return false;
    }
  }, [getValues, fees, txRequestGasLimit]);

  function getHeader() {
    if (hasErrors)
      return <ErrorHeader errors={errors} suggestedMinFee={suggestedMinFee} />;
    if (isExecuted)
      return (
        <TxHeader id={tx?.id} type={tx?.type} status={status || undefined} />
      );

    return null;
  }

  return (
    <>
      {getHeader()}
      <Box css={styles.content}>
        {isSimulating && !tx && <TxContent.Loader showHeaderLoader={false} />}
        {!!transaction && (
          <>
            <TxOperations
              operations={transaction.categorizedOperations}
              txAccount={account}
              isPastTense={isPastTense}
            />
            <TxFeeSection>
              {(isLoadingFees || (isLoading && !showDetails)) && (
                <TxFee.Loader />
              )}
              {showDetails && !fees?.baseFee && (
                <TxFee fee={transaction?.fee.total} />
              )}
              {showDetails &&
                fees?.baseFee &&
                txRequestGasLimit &&
                fees?.regularTip &&
                fees?.fastTip &&
                !signOnly && (
                  <TxFeeOptions
                    initialAdvanced={initialAdvanced}
                    baseFee={fees.baseFee}
                    gasLimit={txRequestGasLimit}
                    regularTip={fees.regularTip}
                    fastTip={fees.fastTip}
                    suggestedMinFee={suggestedMinFee}
                    autoAdvanced={autoAdvanced}
                  />
                )}
              {showDetails &&
                fees?.baseFee &&
                txRequestGasLimit &&
                signOnly && (
                  <TxFee
                    fee={fees.baseFee.add(
                      fees.regularTip || fees.fastTip || bn(0)
                    )}
                  />
                )}
            </TxFeeSection>
          </>
        )}
      </Box>
      {footer}
    </>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
};

const styles = {
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
  alert: cssObj({
    '& .fuel_Alert-content': {
      gap: '$1',
    },
    ' & .fuel_Heading': {
      fontSize: '$sm',
    },
    '& .fuel_Icon': {
      mt: '-2px',
    },
  }),
};
