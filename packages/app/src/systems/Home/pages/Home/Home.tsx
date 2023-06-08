import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { AssetsTitle, HomeActions } from '../../components';

import { VITE_FUEL_PROVIDER_URL } from '~/config';
import { BalanceWidget, useAccounts } from '~/systems/Account';
import { AssetList } from '~/systems/Asset';
import { Layout, Pages } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';
import { useNetworks } from '~/systems/Network';

export function Home() {
  const { visibility, setVisibility } = useBalanceVisibility();
  const { isLoading, account, balanceAssets } = useAccounts();
  const { selectedNetwork } = useNetworks();
  const navigate = useNavigate();

  function sendAction() {
    navigate(Pages.send());
  }

  const goToReceive = () => {
    navigate(Pages.receive());
  };

  return (
    <Layout title="Home" isHome>
      <Layout.TopBar />
      <Layout.Content noBorder>
        <Box.Flex css={{ height: '100%', flexDirection: 'column' }}>
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
          <Box.Stack css={styles.assets}>
            <AssetsTitle />
            <AssetList
              assets={balanceAssets}
              isLoading={isLoading}
              emptyProps={{
                showFaucet: selectedNetwork?.url === VITE_FUEL_PROVIDER_URL,
              }}
            />
          </Box.Stack>
        </Box.Flex>
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  assets: cssObj({
    gap: '$4',
    px: '$4',
  }),
};
