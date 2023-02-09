import { Flex } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { AssetsTitle, HomeActions } from '../../components';

import { BalanceWidget, useAccounts } from '~/systems/Account';
import { AssetList } from '~/systems/Asset';
import { Layout, Pages } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

export function Home() {
  const { visibility, setVisibility } = useBalanceVisibility();
  const { isLoading, account } = useAccounts();
  const navigate = useNavigate();

  function sendAction() {
    navigate(Pages.send());
  }

  const goToReceive = () => {
    navigate(Pages.receive());
  };

  return (
    <Layout title="Home" isLoading={isLoading} isHome>
      <Layout.TopBar />
      <Layout.Content>
        <Flex css={{ height: '100%', flexDirection: 'column' }}>
          <BalanceWidget
            visibility={visibility}
            account={account}
            isLoading={isLoading}
            onChangeVisibility={setVisibility}
          />
          <HomeActions
            receiveAction={goToReceive}
            sendAction={sendAction}
            isDisabled={isLoading}
          />
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
