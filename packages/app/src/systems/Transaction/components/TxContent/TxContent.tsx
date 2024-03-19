import { Box } from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import type { TransactionStatus, TransactionSummary } from 'fuels';
import type { ReactNode } from 'react';
import type { Maybe } from '~/systems/Core';
import { MotionStack, animations } from '~/systems/Core';
import { TxDetails, TxOperations } from '~/systems/Transaction';

type TxContentLoaderProps = {
  header?: ReactNode;
};

function TxContentLoader({ header }: TxContentLoaderProps) {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4">
      {header}
      <TxOperations.Loader />
      <TxDetails.Loader />
    </MotionStack>
  );
}

type TxContentInfoProps = {
  header?: ReactNode;
  footer?: ReactNode;
  tx?: Maybe<TransactionSummary>;
  txStatus?: Maybe<TransactionStatus>;
  showDetails?: boolean;
  assets?: Maybe<AssetData[]>;
  isLoading?: boolean;
};

function TxContentInfo({
  tx,
  txStatus,
  header,
  footer,
  showDetails,
  assets,
  isLoading,
}: TxContentInfoProps) {
  const status = tx?.status || txStatus;
  return (
    <Box.Stack gap="$4">
      {header}
      <TxOperations
        operations={tx?.operations}
        status={status}
        assets={assets}
        isLoading={isLoading}
      />
      {isLoading && !showDetails && <TxDetails.Loader />}
      {showDetails && <TxDetails fee={tx?.fee} />}
      {footer}
    </Box.Stack>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
};
