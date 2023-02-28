import { Stack, Button, Flex } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { useNavigate } from 'react-router-dom';

import { Header } from '../Header';

import { PinWalletCard, PinWalletText } from './components';

import { IS_CRX } from '~/config';
import { AccountItem } from '~/systems/Account';
import type { Maybe } from '~/systems/Core';
import { Pages, ImageLoader, relativeUrl } from '~/systems/Core';

export type WalletCreatedProps = {
  account?: Maybe<Account>;
};

export function WalletCreated({ account }: WalletCreatedProps) {
  const navigate = useNavigate();

  function handleGoToWallet() {
    navigate(Pages.wallet());
  }

  return (
    <>
      {IS_CRX && <PinWalletCard />}
      <Stack gap="$6">
        <Flex justify="center">
          <ImageLoader
            src={relativeUrl('/signup-illustration-3.svg')}
            width={129}
            height={116}
          />
        </Flex>
        <Header
          title="Wallet created successfully"
          subtitle="Below is your first Fuel wallet account"
        />
        {account && <AccountItem account={account} />}
        {IS_CRX ? (
          <PinWalletText />
        ) : (
          <Button color="accent" onPress={handleGoToWallet}>
            Go to wallet
          </Button>
        )}
      </Stack>
    </>
  );
}
