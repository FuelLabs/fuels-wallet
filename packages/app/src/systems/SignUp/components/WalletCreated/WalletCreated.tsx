import { cssObj, Box, Button } from '@fuel-wallet/ui';
import type { Account } from '@fuel-wallet/types';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { IS_CRX } from '~/config';
import { AccountItem } from '~/systems/Account';
import type { Maybe } from '~/systems/Core';
import { MotionStack, Pages, animations } from '~/systems/Core';

import { useSignUpStepper } from '../../hooks';
import { Header } from '../Header';
import { PinWalletText } from '../PinWalletText';
import { Stepper } from '../Stepper';

export type WalletCreatedProps = {
  account?: Maybe<Account>;
};

const CREATE_RECEIPT = [
  'Recovery phrase backed up',
  'Recovery phrase confirmed',
  'Password set',
  'Account ready',
];
const IMPORT_RECEIPT = [
  'Recovery phrase imported',
  'Password set',
  'Account ready',
];

/* The receipt starts once the stepper has flashed through its squares. */
const RECEIPT_DELAY_MS = 600;
const RECEIPT_STAGGER_MS = 90;

export function WalletCreated({ account }: WalletCreatedProps) {
  const navigate = useNavigate();
  const { steps, labels, isImport } = useSignUpStepper();
  const receipt = isImport ? IMPORT_RECEIPT : CREATE_RECEIPT;
  const ticksDelay = RECEIPT_DELAY_MS + receipt.length * RECEIPT_STAGGER_MS;

  function handleGoToWallet() {
    navigate(Pages.wallet());
  }

  return (
    <Box.Stack
      gap="$6"
      css={styles.root}
      style={
        {
          '--receipt-delay': `${RECEIPT_DELAY_MS}ms`,
          '--receipt-stagger': `${RECEIPT_STAGGER_MS}ms`,
          '--ticks-delay': `${ticksDelay}ms`,
        } as CSSProperties
      }
    >
      <Stepper steps={steps} labels={labels} active={steps + 1} />
      <Header
        title="Wallet created successfully"
        subtitle="Below is your first Fuel wallet account"
      />
      <Box as="ul" className="receipt" aria-label="Setup summary">
        {receipt.map((item, i) => (
          <li key={item} style={{ '--i': i } as CSSProperties}>
            <span className="fuel-square" aria-hidden />
            {item}
          </li>
        ))}
      </Box>
      <MotionStack {...animations.slideInRight()} gap="$6">
        {IS_CRX ? (
          <PinWalletText />
        ) : (
          <>
            {account && (
              <Box className="fuel-ticks account">
                <AccountItem account={account} canOpenExplorer />
              </Box>
            )}
            <Button intent="primary" onPress={handleGoToWallet}>
              Go to wallet
            </Button>
          </>
        )}
      </MotionStack>
    </Box.Stack>
  );
}

/*
 * One sequence across the screen: the stepper's squares flash, the receipt
 * rows land one by one, then corner ticks snap onto the account. Nothing
 * waits on it; the content is readable and the button usable from the start.
 */
const styles = {
  root: cssObj({
    width: '$sm',

    '.receipt': {
      display: 'flex',
      flexDirection: 'column',
      gap: '$2',
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    '.receipt li': {
      display: 'flex',
      alignItems: 'center',
      gap: '$3',
      fontFamily: '$mono',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: '$textMid',
      animation: 'fuel-appear 200ms var(--fuel-ease-out) backwards',
      animationDelay:
        'calc(var(--receipt-delay) + var(--i) * var(--receipt-stagger))',
    },
    '.receipt .fuel-square': {
      animation: 'fuel-pop 520ms var(--fuel-ease-out) both',
      animationDelay:
        'calc(var(--receipt-delay) + var(--i) * var(--receipt-stagger))',
    },
    '.account::before, .account::after': {
      animationDelay: 'var(--ticks-delay)',
    },

    '@media (prefers-reduced-motion: reduce)': {
      '.receipt li, .receipt .fuel-square, .account::before, .account::after': {
        animation: 'none',
      },
    },
  }),
};
