import { cssObj } from '@fuel-ui/css';
import { Button, Text } from '@fuel-ui/react';

import { ConnectInfo } from '../../components';
import { useAddAssetRequest } from '../../hooks';

import { useAccounts } from '~/systems/Account';
import { AssetItem } from '~/systems/Asset';
import { Layout, shortAddress } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';

export function AddAssetRequest() {
  const { handlers, asset } = useAddAssetRequest();
  const { account } = useAccounts();

  if (!origin || !asset || !account) return null;

  const { assetId, name, symbol, imageUrl } = asset;

  return (
    <Layout title="Add Asset Request">
      <Layout.TopBar type={TopBarType.external} />
      <Layout.Content>
        <ConnectInfo account={account} origin={origin} isReadOnly />
        <Text css={styles.title}>
          This request will add new <b>Asset information</b> to your Wallet
          Settings.
        </Text>
        <AssetItem asset={{ assetId, imageUrl, name, symbol }} />
        <Text fontSize="sm" css={styles.assetId}>
          Asset ID: {shortAddress(assetId)}
        </Text>
      </Layout.Content>
      <Layout.BottomBar>
        <Button color="gray" variant="ghost" onPress={handlers.reject}>
          Reject
        </Button>
        <Button type="submit" color="accent" onPress={handlers.addAsset}>
          Add Asset
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  title: cssObj({
    m: '$4',
    mt: '$8',
    textAlign: 'center',
  }),
  assetId: cssObj({
    mt: '$4',
    fontSize: '$xs',
    fontWeight: '$semibold',
    wordBreak: 'break-all',
    textAlign: 'center',
  }),
};
