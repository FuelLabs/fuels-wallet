import { Flex } from '@fuel-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { AssetsTitle, HomeActions } from '../../components';

import { BalanceWidget, useAccount } from '~/systems/Account';
import { AssetList } from '~/systems/Asset';
import { Layout, Pages } from '~/systems/Core';

export function Home() {
  const { isLoading, account } = useAccount();
  const navigate = useNavigate();

  const goToReceive = useCallback(() => {
    navigate(Pages.receive());
  }, [navigate]);

  return (
    <Layout title="Home" isLoading={isLoading} isHome>
      <Layout.TopBar />
      <Layout.Content>
        <Flex css={{ height: '100%', flexDirection: 'column' }}>
          <BalanceWidget account={account} isLoading={isLoading} />
          <HomeActions receiveAction={goToReceive} isDisabled={isLoading} />
          <AssetsTitle />
          <AssetList
            assets={account?.balances}
            isLoading={isLoading}
            isDevnet
          />
        </Flex>
      </Layout.Content>
    </Layout>
  );
}
