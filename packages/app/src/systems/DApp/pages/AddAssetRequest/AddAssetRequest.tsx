import { cssObj } from '@fuel-ui/css';
import { Button, Card, Text } from '@fuel-ui/react';

import { useAddAssetRequest } from '../../hooks';

import { useAccounts } from '~/systems/Account';
import { AssetItem } from '~/systems/Asset';
import { Layout, OriginDetails, shortAddress } from '~/systems/Core';

export function AddAssetRequest() {
  const { handlers, assets, title, favIconUrl } = useAddAssetRequest();
  const { account } = useAccounts();

  if (!origin || !assets?.length || !account) return null;

  return (
    <Layout title="Asset Add Request">
      <Layout.Content css={styles.content}>
        <OriginDetails
          origin={origin}
          title={title || ''}
          favIconUrl={favIconUrl}
          headerText="Request to Add Assets from:"
        />
        <Card css={styles.card} gap="$0">
          <Card.Header css={styles.cardHeader}>
            <Text fontSize="sm" css={styles.cardHeaderText}>
              Review the Assets to be added:
            </Text>
          </Card.Header>
          <Card.Body css={styles.cardContentSection}>
            {assets.map((asset) => (
              <AssetItem
                key={asset.assetId}
                asset={{
                  ...asset,
                  symbol: `${asset.symbol} - ${shortAddress(asset.assetId)}`,
                }}
              />
            ))}
          </Card.Body>
        </Card>
      </Layout.Content>
      <Layout.BottomBar>
        <Button color="gray" variant="ghost" onPress={handlers.reject}>
          Reject
        </Button>
        <Button type="submit" color="accent" onPress={handlers.addAsset}>
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
    fontSize: '$xs',
    fontWeight: '$semibold',
    wordBreak: 'break-all',
    textAlign: 'center',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    paddingBottom: '$0',
    '& h2': {
      fontSize: '$sm',
    },
    '& a': {
      fontSize: '$sm',
      fontWeight: '$bold',
    },
  }),
  card: cssObj({
    boxSizing: 'border-box',
  }),
  cardHeader: cssObj({
    px: '$3',
    py: '$2',
    display: 'flex',
  }),
  cardHeaderText: cssObj({
    color: '$gray12',
    fontWeight: '$bold',
  }),
  cardContentSection: cssObj({
    padding: '0',
    gap: '$3',
  }),
};
