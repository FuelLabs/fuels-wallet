import { Box, Button } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
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

export function WalletCreated({ account }: WalletCreatedProps) {
  const navigate = useNavigate();
  const { steps } = useSignUpStepper();

  function handleGoToWallet() {
    navigate(Pages.wallet());
  }

  return (
    <Box.Stack gap="$6" css={{ width: '$sm' }}>
      <Stepper steps={steps} active={5} />
      <Header
        title="Wallet created successfully"
        subtitle="Below is your first Fuel wallet account"
      />
      <MotionStack {...animations.slideInRight()} gap="$6">
        {IS_CRX ? (
          <PinWalletText />
        ) : (
          <>
            {account && <AccountItem account={account} canOpenExplorer />}
            <Button intent="primary" onPress={handleGoToWallet}>
              Go to wallet
            </Button>
          </>
        )}
      </MotionStack>
    </Box.Stack>
  );
}
