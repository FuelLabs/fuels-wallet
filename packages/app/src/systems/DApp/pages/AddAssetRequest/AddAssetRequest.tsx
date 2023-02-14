import { cssObj } from '@fuel-ui/css';
import { Alert, Button, Card, Copyable, Text } from '@fuel-ui/react';

import { useAddAssetRequest } from '../../hooks';

import { useAccounts } from '~/systems/Account';
import { AssetItem } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
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
        <Text css={{ mb: '$3' }}>Your new asset will look like this:</Text>
        <AssetItem asset={{ assetId, imageUrl, name, symbol }} />
        <Card css={styles.card}>
          <Card.Body css={styles.cardBody}>
            <Text fontSize="sm">Asset ID:</Text>
            <Copyable
              value={assetId}
              css={{
                mt: '$1',
                fontSize: '$xs',
                fontWeight: '$semibold',
                wordBreak: 'break-word',
              }}
            >
              {assetId}
            </Copyable>
          </Card.Body>
        </Card>
        <Alert css={{ maxW: '700px' }} direction="row">
          <Alert.Description css={{ fontSize: '$sm' }}>
            This request won&apos;t add funds. It will only add asset
            information to Wallet Settings.
          </Alert.Description>
        </Alert>
      </Layout.Content>
      <Layout.BottomBar>
        <Button color="gray" variant="ghost" onPress={() => handlers.reject()}>
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
  card: cssObj({
    mt: '$4',
    mb: '$4',
  }),
  cardBody: cssObj({
    p: '$3',
  }),
  listItemAllowed: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
  listItemDisallowed: cssObj({
    fontSize: '$sm',
  }),
  connectionDetails: cssObj({
    marginTop: '$3',
    px: '$3',
    paddingTop: '$2',
    paddingBottom: '$4',
  }),
  disclaimer: cssObj({
    mb: '-10px',
    pt: '$1',
  }),
  switchWrapper: cssObj({
    alignItems: 'center',
    justifyContent: 'center',
  }),
  accountList: cssObj({
    mt: '$4',
  }),
  sectionHeader: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  connectCard: cssObj({
    p: '$3',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '$2',
  }),
};
