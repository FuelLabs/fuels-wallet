import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  CardList,
  ContentLoader,
  Text,
  VStack,
} from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import type { BN, TransactionStatus, TransactionSummary } from 'fuels';
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
} from '~/systems/Transaction';
import { TxFeeOptions } from '../TxFeeOptions/TxFeeOptions';

const ErrorHeader = ({ errors }: { errors?: GroupedErrors }) => {
  return (
    <Alert status="error" css={styles.alert} aria-label="Transaction Error">
      <Alert.Description
        as="div"
        css={{
          wordBreak: 'break-word',
        }}
      >
        {errors}
      </Alert.Description>
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

type TxContentInfoProps = {
  footer?: ReactNode;
  tx?: Maybe<TransactionSummary>;
  txStatus?: Maybe<TransactionStatus>;
  showDetails?: boolean;
  assets?: Maybe<AssetData[]>;
  isLoading?: boolean;
  isConfirm?: boolean;
  errors?: GroupedErrors;
  providerUrl?: string;
  fees?: {
    baseFee?: BN;
    minGasLimit?: BN;
    regularTip?: BN;
    fastTip?: BN;
  };
};

function TxContentInfo({
  tx,
  txStatus,
  footer,
  showDetails,
  assets,
  isLoading,
  isConfirm,
  errors,
  providerUrl,
  fees,
}: TxContentInfoProps) {
  const { getValues } = useFormContext<SendFormValues>();

  const status = txStatus || tx?.status || txStatus;
  const hasErrors = Boolean(Object.keys(errors || {}).length);
  const isExecuted = !!tx?.id;

  const initialAdvanced = useMemo(() => {
    if (!fees?.regularTip || !fees?.minGasLimit) return false;

    return (
      !getValues('fees.tip.amount').eq(fees.regularTip) ||
      !getValues('fees.gasLimit.amount').eq(fees.minGasLimit)
    );
  }, [getValues, fees]);

  function getHeader() {
    if (hasErrors) return <ErrorHeader errors={errors} />;
    if (isConfirm) return <ConfirmHeader />;
    if (isExecuted)
      return (
        <TxHeader
          id={tx?.id}
          type={tx?.type}
          status={status || undefined}
          providerUrl={providerUrl}
        />
      );

    return <ConfirmHeader />;
  }

  return (
    <Box.Stack gap="$4">
      {getHeader()}
      <TxOperations
        operations={tx?.operations}
        status={status}
        assets={assets}
        isLoading={isLoading}
      />
      {isLoading && !showDetails && <TxFee.Loader />}
      {showDetails && !fees && <TxFee fee={tx?.fee} />}
      {showDetails &&
        fees?.baseFee &&
        fees?.minGasLimit &&
        fees?.regularTip &&
        fees?.fastTip && (
          <VStack gap="$3">
            <Text as="span">Fee (network)</Text>
            <TxFeeOptions
              initialAdvanced={initialAdvanced}
              baseFee={fees.baseFee}
              minGasLimit={fees.minGasLimit}
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
