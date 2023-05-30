import { Button, Box } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { useNavigate } from 'react-router-dom';

import { useSignUpStepper } from '../../hooks';
import { Header } from '../Header';
import { PinWalletText } from '../PinWalletText';
import { Stepper } from '../Stepper';

import { IS_CRX } from '~/config';
import { AccountItem } from '~/systems/Account';
import type { Maybe } from '~/systems/Core';
import { Pages } from '~/systems/Core';

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
    <Box.Stack gap="$6">
      <Stepper steps={steps} active={4} />
      <Header
        title="Wallet created successfully"
        subtitle="Below is your first Fuel wallet account"
      />
      {IS_CRX ? (
        <PinWalletText />
      ) : (
        <>
          {account && <AccountItem account={account} />}
          <Button intent="primary" onPress={handleGoToWallet}>
            Go to wallet
          </Button>
        </>
      )}
    </Box.Stack>
  );
}
