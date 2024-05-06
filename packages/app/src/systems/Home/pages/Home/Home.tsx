import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VITE_FUEL_PROVIDER_URL } from '~/config';
import { BalanceWidget, useAccounts } from '~/systems/Account';
import { MemoAssetList } from '~/systems/Asset';
import { Layout, Pages, scrollable } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';
import { useNetworks } from '~/systems/Network';

import { AssetsTitle, HomeActions } from '../../components';

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

  const emptyProps = useMemo(() => {
    return { showFaucet: selectedNetwork?.url === VITE_FUEL_PROVIDER_URL };
  }, [selectedNetwork]);

  return (
    <Layout title="Home" isHome>
      <Layout.TopBar />
      <Layout.Content noBorder css={styles.content}>
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
            <Box css={styles.assetsTitle}>
              <AssetsTitle />
            </Box>
            <Box.Stack css={styles.assetsList}>
              <MemoAssetList
                assets={balanceAssets}
                isLoading={isLoading}
                emptyProps={emptyProps}
              />
            </Box.Stack>
          </Box.Stack>
        </Box.Flex>
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    flex: 1,
    overflow: 'hidden',
  }),
  assets: cssObj({
    gap: '$2',
    overflow: 'hidden',
    flex: 1,
  }),
  assetsTitle: cssObj({
    px: '$4',
  }),
  assetsList: cssObj({
    padding: '$2 $0 $4 $4',
    ...scrollable(),
    overflowY: 'scroll !important',
  }),
};
