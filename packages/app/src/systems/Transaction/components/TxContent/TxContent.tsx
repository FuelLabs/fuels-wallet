import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Stack, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import type { BN } from 'fuels';
import type { ReactNode } from 'react';

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
  tx?: Maybe<Tx>;
  amount?: Maybe<BN>;
  showDetails?: boolean;
};

function TxContentInfo({
  tx,
  amount,
  header,
  showDetails,
}: TxContentInfoProps) {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4">
      {header}
      <TxOperations operations={tx?.operations} />
      {showDetails && <TxDetails fee={tx?.fee} amountSent={amount!} />}
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
