import { Box } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import type { Maybe } from '~/systems/Core';
import { animations } from '~/systems/Core';
import type { Tx, TxStatus } from '~/systems/Transaction';
import { TxOperations, TxDetails } from '~/systems/Transaction';

const MotionStack = motion(Box.Stack);

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
  tx?: Maybe<Tx>;
  txStatus?: Maybe<TxStatus>;
  showDetails?: boolean;
  assets?: Maybe<Asset[]>;
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
      {showDetails && <TxDetails fee={tx?.fee} />}
      {footer}
    </Box.Stack>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
};
