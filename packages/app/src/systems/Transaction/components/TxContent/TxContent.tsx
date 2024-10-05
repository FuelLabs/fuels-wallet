import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  CardList,
  ContentLoader,
  Copyable,
  Icon,
  Text,
  VStack,
} from '@fuel-ui/react';
import type {
  BN,
  TransactionRequest,
  TransactionStatus,
  TransactionSummary,
} from 'fuels';
import { type ReactNode, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Maybe } from '~/systems/Core';
import { MotionStack, animations } from '~/systems/Core';
import type { SendFormValues } from '~/systems/Send/hooks';
import {
  type GroupedErrors,
  TxFee,
  TxHeader,
  TxOperations,
  getGasLimitFromTxRequest,
} from '~/systems/Transaction';
import { TxFeeOptions } from '../TxFeeOptions/TxFeeOptions';

const ErrorHeader = ({ errors }: { errors?: GroupedErrors }) => {
  return (
    <Alert status="error" css={styles.alert} aria-label="Transaction Error">
      <Copyable
        value={errors ?? ''}
        aria-label={errors}
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
          {errors}
        </Alert.Description>
      </Copyable>
    </Alert>
  );
};

const ConfirmHeader = () => (
  <Alert status="warning" css={styles.alert} aria-label="Confirm Transaction">
    <Alert.Description>
      Carefully check if all the details in your transaction are correct
    </Alert.Description>
  </Alert>
);

const LoaderHeader = () => (
  <CardList.Item
    css={{ padding: '$2 !important' }}
    aria-label="Loading Transaction"
  >
    <ContentLoader width={300} height={40} viewBox="0 0 300 40">
      <rect x="20" y="10" rx="4" ry="4" width="92" height="20" />
    </ContentLoader>
  </CardList.Item>
);

function TxContentLoader() {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4">
      <LoaderHeader />
      <TxOperations.Loader />
      <TxFee.Loader />
    </MotionStack>
  );
}

export type TxContentInfoProps = {
  footer?: ReactNode;
  tx?: Maybe<TransactionSummary>;
  txStatus?: Maybe<TransactionStatus>;
  showDetails?: boolean;
  isLoading?: boolean;
  isConfirm?: boolean;
  errors?: GroupedErrors;
  fees?: {
    baseFee?: BN;
    regularTip?: BN;
    fastTip?: BN;
  };
  txRequest?: TransactionRequest;
};

function TxContentInfo({
  tx,
  txStatus,
  footer,
  showDetails,
  isLoading,
  isConfirm,
  errors,
  fees,
  txRequest,
}: TxContentInfoProps) {
  const { getValues } = useFormContext<SendFormValues>();

  const status = txStatus || tx?.status || txStatus;
  const hasErrors = Boolean(Object.keys(errors || {}).length);
  const isExecuted = !!tx?.id;
  const txRequestGasLimit = getGasLimitFromTxRequest(txRequest);

  const initialAdvanced = useMemo(() => {
    if (!fees?.regularTip || !fees?.fastTip) return false;

    // it will start as advanced if the transaction tip is not equal to the regular tip and fast tip
    const isFeeAmountTheRegularTip = getValues('fees.tip.amount').eq(
      fees.regularTip
    );
    const isFeeAmountTheFastTip = getValues('fees.tip.amount').eq(fees.fastTip);
    // it will start as advanced if the gasLimit if different from the tx gasLimit
    const isGasLimitTheTxRequestGasLimit = getValues('fees.gasLimit.amount').eq(
      txRequestGasLimit
    );

    return (
      (!isFeeAmountTheRegularTip && !isFeeAmountTheFastTip) ||
      !isGasLimitTheTxRequestGasLimit
    );
  }, [getValues, fees, txRequestGasLimit]);

  function getHeader() {
    if (hasErrors) return <ErrorHeader errors={errors} />;
    if (isConfirm) return <ConfirmHeader />;
    if (isExecuted)
      return (
        <TxHeader id={tx?.id} type={tx?.type} status={status || undefined} />
      );

    return <ConfirmHeader />;
  }

  return (
    <Box.Stack gap="$4">
      {getHeader()}
      <TxOperations
        operations={tx?.operations}
        status={status}
        isLoading={isLoading}
      />
      {isLoading && !showDetails && <TxFee.Loader />}
      {showDetails && !fees && <TxFee fee={tx?.fee} />}
      {showDetails &&
        fees?.baseFee &&
        txRequestGasLimit &&
        fees?.regularTip &&
        fees?.fastTip && (
          <VStack gap="$3">
            <Text as="span">Fee (network)</Text>
            <TxFeeOptions
              initialAdvanced={initialAdvanced}
              baseFee={fees.baseFee}
              gasLimit={txRequestGasLimit}
              regularTip={fees.regularTip}
              fastTip={fees.fastTip}
            />
          </VStack>
        )}
      {footer}
    </Box.Stack>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
};

const styles = {
  fees: cssObj({
    color: '$intentsBase12',
    fontSize: '$md',
    fontWeight: '$normal',
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
