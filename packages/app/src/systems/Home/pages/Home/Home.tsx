import { cssObj } from '@fuel-ui/css';
import { Button, Tabs } from '@fuel-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BalanceWidget, useAccounts } from '~/systems/Account';
import { Layout, Pages, scrollable } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

import { bn } from 'fuels';
import { BalanceAssets } from '~/systems/Account/components/BalanceAssets/BalanceAssets';
import { BalanceNFTs } from '~/systems/Account/components/BalanceNFTs/BalanceNFTs';
import { BALANCE_NFTS_TAB_HEIGHT } from '~/systems/Account/components/BalanceNFTs/constants';
import { QuickAccountConnect } from '~/systems/Account/components/QuickAccountConnect/QuickAccountConnect';
import { TxService } from '~/systems/Transaction/services/transaction';
import { HomeActions } from '../../components';

export function Home() {
  const { visibility, setVisibility } = useBalanceVisibility();
  const { isLoading, account } = useAccounts();
  const navigate = useNavigate();

  // import { bn, DECIMAL_FUEL, Provider, Wallet } from 'fuels';
  // useEffect(() => {
  //   async function a() {
  //     const provider = new Provider('https://testnet.fuel.network/v1/graphql');
  //     const sender = Wallet.fromPrivateKey(
  //       '0x946fa67e7b08c0d4c34472263a20b1267915ffc77c6d2ed02a67fabfe24a90d1',
  //       provider
  //     );
  //     const assetId = await provider.getBaseAssetId();
  //     const recipient = Wallet.fromAddress(
  //       '0x5502F46f90C3C68c85489b1F57Ae6146C81E8549Daf408574e3a9a0bB80C4bA0',
  //       provider
  //     );
  //     for (let i = 0; i < 600; i++) {
  //       const tx = await sender.transfer(
  //         recipient.address,
  //         bn.parseUnits('0.0001', DECIMAL_FUEL),
  //         assetId
  //       );
  //       await tx.waitForResult();
  //       console.log(`Transfer ${i + 1} done:`, tx.id);
  //     }
  //   }
  //   a();
  // }, []);

  useEffect(() => {
    async function a() {
      try {
        if (account?.balance.gt(0)) {
          const tx = await TxService.createTransfer({
            amount: account?.balance,
            assetId:
              '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
            // any test address as this is only for checking if has consolidation issues
            to: '0x5502F46f90C3C68c85489b1F57Ae6146C81E8549Daf408574e3a9a0bB80C4bA0',
            tip: bn(0),
            gasLimit: bn(0),
          });
          console.log(tx);
        }
      } catch (error) {
        console.log(error);
      }
    }
    a();
  }, [account?.balance]);

  function sendAction() {
    navigate(Pages.send());
  }

  const goToReceive = () => {
    navigate(Pages.receive());
  };

  const goToConsolidateCoins = () => {
    navigate(Pages.consolidateCoins());
  };

  return (
    <Layout title="Home" isHome>
      <Layout.TopBar />
      <Layout.Content noBorder noScroll>
        <QuickAccountConnect />
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
        <Button onPress={goToConsolidateCoins}>Consolidate Coins (DEV)</Button>
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
