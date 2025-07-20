import { cssObj } from '@fuel-ui/css';
import { Tabs } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { BalanceWidget, useAccounts } from '~/systems/Account';
import { QuickConsolidateCoins } from '~/systems/ConsolidateCoins/components/QuickConsolidateCoins';
import { Layout, Pages, scrollable } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

import { BalanceAssets } from '~/systems/Account/components/BalanceAssets/BalanceAssets';
import { BalanceNFTs } from '~/systems/Account/components/BalanceNFTs/BalanceNFTs';
import { BALANCE_NFTS_TAB_HEIGHT } from '~/systems/Account/components/BalanceNFTs/constants';
import { QuickAccountConnect } from '~/systems/Account/components/QuickAccountConnect/QuickAccountConnect';
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
      <Layout.Content noBorder noScroll>
        <QuickAccountConnect />
        <QuickConsolidateCoins />
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
            <Tabs.Trigger value="nft" aria-label="NFTs">
              NFTs
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="assets" css={styles.assetsList}>
            <BalanceAssets balances={account?.balances} isLoading={isLoading} />
          </Tabs.Content>
          <Tabs.Content value="nft" css={styles.assetsList}>
            <BalanceNFTs balances={account?.balances} isLoading={isLoading} />
          </Tabs.Content>
        </Tabs>
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  assets: cssObj({
    paddingLeft: '$4',

    '.fuel_TabsList': {
      marginBottom: '$3',
    },
  }),
  assetsList: cssObj({
    height: BALANCE_NFTS_TAB_HEIGHT,
    ...scrollable(),
    overflowY: 'scroll !important',
  }),
};
