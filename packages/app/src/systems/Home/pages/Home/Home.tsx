/* eslint-disable no-alert */
import { Flex } from '@fuel-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { AssetsTitle, HomeActions } from '../../components';

import { BalanceWidget, useAccount } from '~/systems/Account';
import { AssetList } from '~/systems/Asset';
import { Layout, Pages } from '~/systems/Core';

export function Home() {
  const { isLoading, selectedAccount, handlers } = useAccount();
  const navigate = useNavigate();

  const sendAction = useCallback(() => {
    window.alert('Send is not implemeted yet');
  }, []);

  const goToReceive = useCallback(() => {
    navigate(Pages.receive());
  }, [navigate]);

  return (
    <Layout title="Home" isLoading={isLoading} isHome>
      <Layout.TopBar />
      <Layout.Content>
        <Flex css={{ height: '100%', flexDirection: 'column' }}>
          <BalanceWidget
            isHidden={selectedAccount?.isHidden ?? true}
            account={selectedAccount}
            isLoading={isLoading}
            onChangeVisibility={handlers.setBalanceVisibility}
          />
          <HomeActions
            receiveAction={goToReceive}
            sendAction={sendAction}
            isDisabled={isLoading}
          />
          <AssetsTitle />
          <AssetList
            assets={selectedAccount?.balances}
            isLoading={isLoading}
            isDevnet
          />
        </Flex>
      </Layout.Content>
    </Layout>
  );
}
