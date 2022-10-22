import { Stack, Button, Flex } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { Header } from '../Header';

import { IS_CRX } from '~/config';
import type { Account } from '~/systems/Account';
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
        subtitle="These are your Fuel wallet details"
      />
      {account && <AccountItem account={account} />}
      {!IS_CRX && (
        <Button size="sm" color="accent" onPress={handleGoToWallet}>
          Go to wallet
        </Button>
      )}
    </Stack>
  );
}
