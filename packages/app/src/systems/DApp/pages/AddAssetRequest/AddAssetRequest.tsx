import { cssObj } from '@fuel-ui/css';
import { Button, Card, Copyable, Image, Text } from '@fuel-ui/react';

import { ConnectInfo } from '../../components';
import { useAddAssetRequest } from '../../hooks';

import { useAccounts } from '~/systems/Account';
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
        <ConnectInfo origin={origin} account={account} isReadOnly />
        <Card css={styles.card}>
          <Card.Body css={styles.cardBody}>
            <Text fontSize="sm" css={{ mt: '$3' }}>
              Asset ID:
            </Text>
            <Text css={{ mt: '$1', fontWeight: '$semibold' }}>
              <Copyable value={assetId}>{shortAddress(assetId)}</Copyable>
            </Text>
            <Text fontSize="sm" css={{ mt: '$3' }}>
              Name:
            </Text>
            <Text css={{ mt: '$1', fontWeight: '$semibold' }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{name}</div>
            </Text>
            <Text fontSize="sm" css={{ mt: '$3' }}>
              Symbol:
            </Text>
            <Text css={{ mt: '$1', fontWeight: '$semibold' }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{symbol}</div>
            </Text>
            <Text fontSize="sm" css={{ mt: '$3' }}>
              Image:
            </Text>
            <Image
              src={imageUrl}
              css={{ maxW: '40px', maxH: '40px', mt: '$1' }}
            />
          </Card.Body>
        </Card>
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
