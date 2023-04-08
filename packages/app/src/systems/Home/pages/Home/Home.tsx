import { Flex, Button } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { AssetsTitle, HomeActions } from '../../components';

import { BalanceWidget, useAccounts } from '~/systems/Account';
import { AssetList } from '~/systems/Asset';
import { Layout, Pages } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

export function Home() {
  const { visibility, setVisibility } = useBalanceVisibility();
  const { isLoading, account, balanceAssets } = useAccounts();
  const navigate = useNavigate();

  function sendAction() {
    navigate(Pages.send());
  }

  const goToReceive = () => {
    navigate(Pages.receive());
  };

  const goToNfts = () => {
    navigate(Pages.nfts());
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
            assets={balanceAssets}
            isLoading={isLoading}
            emptyProps={{ showFaucet: true }}
          />
        </Flex>
      </Layout.Content>
      <Layout.BottomBar>
        <Button
          aria-label="Assets"
          // variant="ghost"
          // color="gray"
          // onPress={handlers.reject}
          // onPress={() => navigate(Pages.nfts())}
        >
          Assets
        </Button>
        <Button
          aria-label="NFTs"
          // onPress={handlers.sign}
          // isLoading={isLoading}
          variant="ghost"
          onPress={goToNfts}
        >
          NFTs
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}
