import { cssObj } from '@fuel-ui/css';
import { Box, Tabs } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { BalanceWidget, useAccounts } from '~/systems/Account';
import { Layout, Pages, scrollable } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

import { BalanceAssets } from '~/systems/Account/components/BalanceAssets/BalanceAssets';
import { HomeActions } from '../../components';

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
          <Tabs defaultValue="assets" variant="link" css={styles.assets}>
            <Tabs.List>
              <Tabs.Trigger value="assets" aria-label="Assets">
                Assets
              </Tabs.Trigger>
              <Tabs.Trigger value="nft" aria-label="NFT">
                NFT
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="assets" css={styles.assetsList}>
              <BalanceAssets
                balances={account?.balances}
                isLoading={isLoading}
              />
            </Tabs.Content>
            <Tabs.Content value="nft" css={styles.assetsList}>
              NFTs here
            </Tabs.Content>
          </Tabs>
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
    overflow: 'hidden',
    paddingLeft: '$4',

    '.fuel_TabsList': {
      marginBottom: '$3',
    },
  }),
  assetsList: cssObj({
    paddingBottom: '$4',
    ...scrollable(),
    overflowY: 'scroll !important',
  }),
};
