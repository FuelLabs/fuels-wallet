import { cssObj } from '@fuel-ui/css';
import { Accordion, Badge, Box, Icon, Text, VStack } from '@fuel-ui/react';
import type { CoinAsset } from '@fuel-wallet/types';
import { useMemo } from 'react';
import { AssetListEmpty } from '~/systems/Asset/components/AssetList/AssetListEmpty';
import { shortAddress } from '~/systems/Core';
import { NFTImage } from './NFTImage';
import { groupNFTsByCollection } from './groupNFTsByCollection';

interface BalanceNFTsProps {
  balances: CoinAsset[] | undefined;
}

export const BalanceNFTs = ({ balances = [] }: BalanceNFTsProps) => {
  const collections = useMemo(() => {
    return groupNFTsByCollection(balances);
  }, [balances]);

  if (collections.length === 0) {
    return (
      <AssetListEmpty
        text="You don't have any NFTs"
        supportText="To add NFTs, simply send them to your Fuel address."
        hideFaucet
      />
    );
  }

  return (
    <Box css={styles.root}>
      <Accordion type="multiple">
        {collections.map((collection) => {
          return (
            <Accordion.Item key={collection.name} value={collection.name}>
              <Accordion.Trigger>
                <Badge variant="ghost" color="gray" as="span">
                  {collection.nfts.length}
                </Badge>
                {collection.name}
              </Accordion.Trigger>
              <Accordion.Content>
                <Box css={styles.grid}>
                  {collection.nfts.map((nft) => {
                    return (
                      <VStack key={nft.assetId} align="center" gap="$1">
                        <NFTImage assetId={nft.assetId} image={nft.image} />
                        <Text fontSize="xs" css={styles.name}>
                          {nft.name || shortAddress(nft.assetId)}
                        </Text>
                      </VStack>
                    );
                  })}
                </Box>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Box>
  );
};

const styles = {
  root: cssObj({
    '.fuel_Accordion-trigger': {
      fontSize: '$base',
      fontWeight: '$semibold',
      backgroundColor: 'transparent',
      color: '$intentsBase11',
      padding: '$0',
      gap: '2px',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
    },
    '.fuel_Accordion-trigger:hover': {
      color: '$intentsBase12',
    },
    '.fuel_Accordion-trigger[data-state="open"]': {
      color: '$intentsBase12',
    },
    '.fuel_Accordion-trigger[data-state="closed"] .fuel_Accordion-icon': {
      transform: 'rotate(-45deg)',
    },
    '.fuel_Accordion-trigger[data-state="open"] .fuel_Accordion-icon': {
      transform: 'rotate(0deg)',
    },
    '.fuel_Accordion-item': {
      backgroundColor: 'transparent',
      borderBottom: '1px solid $border',
      borderRadius: '$none',
    },
    '.fuel_Accordion-content': {
      border: '0',
      padding: '$0 5px $2 20px',
    },
    '.fuel_Badge': {
      display: 'inline-block',
      fontWeight: '$normal',
      fontSize: '$xs',
      padding: '$1',
      pointerEvents: 'none',
      marginLeft: 'auto',
      lineHeight: 'normal',
    },
  }),
  grid: cssObj({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  }),
  name: cssObj({
    textAlign: 'center',
  }),
};
