import { cssObj } from '@fuel-ui/css';
import { Button, Card } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { AssetItem } from '~/systems/Asset';
import { ConnectInfo, Layout, shortAddress } from '~/systems/Core';

import { getAssetFuel } from 'fuels';
import { useNetworks } from '~/systems/Network/hooks';
import { useAddAssetRequest } from '../../hooks';

export function AddAssetRequest() {
  const { handlers, assets, title, favIconUrl, origin } = useAddAssetRequest();
  const { account } = useAccounts();
  const { network } = useNetworks();

  if (!origin || !assets?.length || !account) return null;

  return (
    <Layout title="Add Asset Request" noBorder>
      <Layout.Content css={styles.content} noBorder>
        <ConnectInfo
          origin={origin}
          title={title || ''}
          favIconUrl={favIconUrl}
          headerText="Request to Add Assets from:"
        />
        <Card css={styles.card}>
          <Card.Header space="compact">
            Review the Assets to be added:
          </Card.Header>
          <Card.Body css={styles.cardContentSection}>
            {assets.map((asset) => {
              const fuelAsset = getAssetFuel(asset, network?.chainId);
              return (
                <AssetItem
                  key={asset.name}
                  asset={{
                    ...asset,
                    symbol: `${asset.symbol} - ${shortAddress(
                      fuelAsset?.assetId
                    )}`,
                  }}
                />
              );
            })}
          </Card.Body>
        </Card>
      </Layout.Content>
      <Layout.BottomBar>
        <Button variant="ghost" onPress={handlers.reject}>
          Reject
        </Button>
        <Button type="submit" intent="primary" onPress={handlers.approve}>
          Add Assets
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
    fontSize: '$sm',
    fontWeight: '$normal',
    wordBreak: 'break-all',
    textAlign: 'center',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    padding: '$4 !important',

    '& h2': {
      fontSize: '$sm',
    },
    '& a': {
      fontSize: '$sm',
      fontWeight: '$normal',
    },
  }),
  card: cssObj({
    boxSizing: 'border-box',
    gap: '$0',

    '.fuel_Card': {
      border: '$none',
    },
  }),
  cardContentSection: cssObj({
    padding: '$0',
    gap: '$3',
  }),
};
