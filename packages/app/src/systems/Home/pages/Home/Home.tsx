import { cssObj, Tabs } from '@fuel-wallet/ui';
import type { CSSProperties } from 'react';
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
import {
  GET_STARTED_HEIGHT,
  GetStarted,
} from '../../components/GetStarted/GetStarted';
import { useGetStarted } from '../../hooks/useGetStarted';

export function Home() {
  const { visibility, setVisibility } = useBalanceVisibility();
  const { isLoading, account } = useAccounts();
  const navigate = useNavigate();
  const getStarted = useGetStarted();
  const assetsHeight =
    BALANCE_NFTS_TAB_HEIGHT - (getStarted.isActive ? GET_STARTED_HEIGHT : 0);

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
          isFirstFunds={getStarted.isFirstFunds}
        />
        <HomeActions
          receiveAction={goToReceive}
          sendAction={sendAction}
          isDisabled={isLoading}
        />
        {getStarted.isActive && (
          <GetStarted
            milestones={getStarted.milestones}
            isFirstFunds={getStarted.isFirstFunds}
            onDismiss={getStarted.dismiss}
          />
        )}
        <Tabs
          defaultValue="assets"
          variant="link"
          css={styles.assets}
          style={{ '--assets-height': `${assetsHeight}px` } as CSSProperties}
        >
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
    height: 'var(--assets-height)',
    ...scrollable(),
    overflowY: 'scroll !important',
  }),
};
