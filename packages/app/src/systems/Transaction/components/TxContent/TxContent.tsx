import { Stack } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';
import { motion } from 'framer-motion';
import type { BN } from 'fuels';
import type { ReactNode } from 'react';

import type { Maybe } from '~/systems/Core';
import { animations } from '~/systems/Core';
import type { Tx, TxStatus } from '~/systems/Transaction';
import { TxOperations, TxDetails } from '~/systems/Transaction';

const MotionStack = motion(Stack);

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
  amount?: Maybe<BN>;
  showDetails?: boolean;
  assets?: Maybe<Asset[]>;
};

function TxContentInfo({
  tx,
  txStatus,
  amount,
  header,
  footer,
  showDetails,
  assets,
}: TxContentInfoProps) {
  const status = tx?.status || txStatus;
  return (
    <MotionStack {...animations.slideInTop()} gap="$3">
      {header}
      <TxOperations
        operations={tx?.operations}
        status={status}
        assets={assets}
      />
      {showDetails && <TxDetails fee={tx?.fee} amountSent={amount!} />}
      {footer}
    </MotionStack>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
};
