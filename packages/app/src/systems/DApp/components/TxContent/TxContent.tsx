import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Stack, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/sdk';
import { motion } from 'framer-motion';
import type { BN } from 'fuels';
import type { ReactNode } from 'react';

import { ConnectInfo } from '../ConnectInfo';

import type { Maybe } from '~/systems/Core';
import {
  animations,
  ImageLoader,
  relativeUrl,
  ContentHeader,
} from '~/systems/Core';
import type { Tx } from '~/systems/Transaction';
import { TxOperations, TxDetails, TxLink } from '~/systems/Transaction';

const MotionStack = motion(Stack);

type TxContentLoaderProps = {
  hideInfo?: boolean;
};

function TxContentLoader({ hideInfo }: TxContentLoaderProps) {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4">
      {!hideInfo && <ConnectInfo.Loader />}
      <TxOperations.Loader />
      <TxDetails.Loader />
    </MotionStack>
  );
}

type TxContentInfoProps = {
  tx?: Maybe<Tx>;
  amountSent?: Maybe<BN>;
  account?: Maybe<Account>;
  origin?: string;
  header?: ReactNode;
};

function TxContentInfo({
  tx,
  amountSent,
  origin,
  account,
  header,
}: TxContentInfoProps) {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4">
      {header}
      {origin && account && (
        <ConnectInfo origin={origin!} account={account!} isReadOnly />
      )}
      <TxOperations operations={tx?.operations} />
      {amountSent && <TxDetails fee={tx?.fee} amountSent={amountSent} />}
    </MotionStack>
  );
}

type TxContentSuccessProps = {
  txHash?: string;
  providerUrl?: string;
  css?: ThemeUtilsCSS;
  footer?: ReactNode;
};

function TxContentSuccess({ footer, ...linkProps }: TxContentSuccessProps) {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4" css={styles.feedback}>
      <ImageLoader
        src={relativeUrl('/tx-success.png')}
        width={200}
        height={161}
        alt="Transaction sent successfully"
      />
      <ContentHeader title="Transaction sent" data-status="success">
        <Text>
          Transaction sent successfully.
          <TxLink {...linkProps} />
        </Text>
        {footer}
      </ContentHeader>
    </MotionStack>
  );
}

type TxContentFailedProps = {
  footer?: ReactNode;
};

function TxContentFailed({ footer }: TxContentFailedProps) {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4" css={styles.feedback}>
      <ImageLoader
        src={relativeUrl('/tx-failed.png')}
        width={186}
        height={161}
        alt="Transaction failed"
      />
      <ContentHeader title="Transaction failed" data-status="failed">
        <Text>
          Transaction failed to run. Please try again or contact support if the
          problem persists.
        </Text>
        {footer}
      </ContentHeader>
    </MotionStack>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
  Success: TxContentSuccess,
  Failed: TxContentFailed,
};

const styles = {
  feedback: cssObj({
    mt: '$10',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),
};
