import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { BalanceWidget, useAccounts } from '~/systems/Account';
import { Layout, Pages, scrollable } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

import { BalanceAssets } from '~/systems/Account/components/BalanceAssets/BalanceAssets';
import { AssetsTitle, HomeActions } from '../../components';

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
              <BalanceAssets
                balances={account?.balances}
                isLoading={isLoading}
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
