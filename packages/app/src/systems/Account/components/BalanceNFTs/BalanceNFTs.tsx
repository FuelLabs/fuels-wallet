import { cssObj } from '@fuel-ui/css';
import { Accordion, Badge, Box, Copyable } from '@fuel-ui/react';
import type { CoinAsset } from '@fuel-wallet/types';
import { memo, useMemo } from 'react';
import { NFTImageLoading } from '~/systems/Account/components/BalanceNFTs/NFTImageLoading';
import { AssetList } from '~/systems/Asset';
import { AssetListEmpty } from '~/systems/Asset/components/AssetList/AssetListEmpty';
import { shortAddress } from '~/systems/Core';
import { NFTImage } from './NFTImage';
import { NFTListItemLoading } from './NFTListItemLoading';
import { NFTTitleLoading } from './NFTTitleLoading';
import {
  UNKNOWN_COLLECTION_TITLE,
  groupNFTsByCollection,
} from './groupNFTsByCollection';

interface BalanceNFTsProps {
  balances: CoinAsset[] | undefined;
  isLoading?: boolean;
}

const EMPTY_ARRAY: CoinAsset[] = [];

export const BalanceNFTs = ({
  balances = EMPTY_ARRAY,
  isLoading,
}: BalanceNFTsProps) => {
  const { collections, defaultValue } = useMemo(() => {
    const collections = groupNFTsByCollection(balances);
    const defaultValue = collections
      .map((collection) => collection.name)
      .filter((collection) => collection !== UNKNOWN_COLLECTION_TITLE);

    return {
      collections,
      defaultValue,
    };
  }, [balances]);

  return (
    <Box css={styles.root}>
      {isLoading && !collections.length && (
        <Box css={styles.titleLoading}>
          <NFTTitleLoading />
          <Box css={styles.gridLoading}>
            <NFTListItemLoading />
            <NFTListItemLoading />
            <NFTListItemLoading />
            <NFTListItemLoading />
            <NFTListItemLoading />
            <NFTListItemLoading />
          </Box>
        </Box>
      )}
      {!isLoading && !collections?.length && (
        <AssetListEmpty
          text="You don't have any NFTs"
          supportText="To add NFTs, simply send them to your Fuel address."
          hideFaucet
        />
      )}
      {!!collections.length && (
        <Accordion type="multiple" defaultValue={defaultValue}>
          {collections.map((collection) => (
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
                      <div key={nft.assetId}>
                        <NFTImage assetId={nft.assetId} image={nft.image} />
                        <Copyable css={styles.name} value={nft.assetId}>
                          {nft.name || shortAddress(nft.assetId)}
                        </Copyable>
                      </div>
                    );
                  })}
                </Box>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Box>
  );
};

const styles = {
  root: cssObj({
    '.fuel_Accordion-trigger': {
      fontSize: '$base',
      fontWeight: '$medium',
      backgroundColor: 'transparent',
      color: '$intentsBase11',
      padding: '$0',
      gap: '$2',
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

      svg: {
        width: '$3',
      },
    },
    '.fuel_Accordion-content': {
      border: '0',
      padding: '$0 5px $2 20px',
    },
    '.fuel_Badge': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: '$normal',
      fontSize: '$xs',
      padding: '$0',
      height: '$5',
      minWidth: '$5',
      pointerEvents: 'none',
      marginLeft: 'auto',
      lineHeight: 'normal',
    },
  }),
  grid: cssObj({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '$3',
  }),
  gridLoading: cssObj({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '$3',
    marginTop: '14px',
    paddingLeft: '$5',
    paddingRight: '$2',
  }),
  titleLoading: cssObj({
    marginTop: '16px',
  }),
  name: cssObj({
    marginTop: '$1',
    gap: '$0',
    fontSize: '$xs',
    lineHeight: '$none',
    textAlign: 'center',
  }),
};
