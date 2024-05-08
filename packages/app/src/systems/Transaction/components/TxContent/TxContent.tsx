import { cssObj } from '@fuel-ui/css';
import { Alert, Box, CardList, ContentLoader } from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import type { TransactionStatus, TransactionSummary } from 'fuels';
import { type ReactNode, useMemo } from 'react';
import type { Maybe } from '~/systems/Core';
import { MotionStack, animations } from '~/systems/Core';
import {
  type GroupedErrors,
  TxFee,
  TxHeader,
  TxOperations,
} from '~/systems/Transaction';

const ErrorHeader = ({ errors }: { errors?: GroupedErrors }) => {
  const errorMessages = useMemo(() => {
    const messages = [];
    if (errors) {
      if (errors.InsufficientInputAmount) messages.push('Not enough funds');

      // biome-ignore lint: will not be a large array
      Object.keys(errors).forEach((key: string) => {
        if (key === 'InsufficientInputAmount') return;

        let errorMessage = `${key}: `;
        try {
          errorMessage += JSON.stringify(errors[key]);
        } catch (_) {
          errorMessage += errors[key];
        }
        messages.push(errorMessage);
      });
    }

    return messages;
  }, [errors]);

  return (
    <Alert status="error" css={styles.alert} aria-label="Transaction Error">
      <Alert.Description as="div">
        {errorMessages.map((message) => (
          <Box key={message}>{message}</Box>
        ))}
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
}: TxContentInfoProps) {
  const status = txStatus || tx?.status || txStatus;
  const hasErrors = Boolean(Object.keys(errors || {}).length);
  const isExecuted = !!tx?.id;

  function getHeader() {
    if (hasErrors) return <ErrorHeader errors={errors} />;
    if (isExecuted)
      return (
        <TxHeader
          id={tx?.id}
          type={tx?.type}
          status={status || undefined}
          providerUrl={providerUrl}
        />
      );
    if (isConfirm) return <ConfirmHeader />;

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
      {showDetails && <TxFee fee={tx?.fee} />}
      {footer}
    </Box.Stack>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
};

const styles = {
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
