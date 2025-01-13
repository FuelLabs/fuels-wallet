import type { CoinAsset } from '@fuel-wallet/types';

export const UNKNOWN_COLLECTION_TITLE = 'Others';

interface NFT {
  assetId: string;
  name: string | undefined;
  image: string | undefined;
}
interface Collection {
  name: string;
  nfts: NFT[];
}

export const groupNFTsByCollection = (balances: CoinAsset[]): Collection[] => {
  const grouped: Collection[] = balances
    // Filter only NFTs
    .filter((balance) => {
      return balance.asset?.contractId && Boolean(balance.asset?.isNft);
    })

    // Group balances by collection name
    .reduce((acc, balance) => {
      const name = balance.asset?.collection || UNKNOWN_COLLECTION_TITLE;
      let collection = acc.find((item) => item.name === name);

      if (!collection) {
        collection = { name, nfts: [] };
        acc.push(collection);
      }

      const image = balance.asset?.metadata?.image?.replace(
        'ipfs://',
        'https://ipfs.io/ipfs/'
      );

      collection.nfts.push({
        assetId: balance.assetId,
        name: balance?.asset?.metadata?.name,
        image,
      });

      return acc;
    }, [] as Collection[])

    // Sort NFTs by name
    .map((collection) => {
      return {
        name: collection.name,
        nfts: collection.nfts.sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name, undefined, {
              numeric: true,
              sensitivity: 'base',
            });
          }

          return 0;
        }),
      };
    })

    // Move "Others" to the bottom
    .sort((a, b) => {
      if (a.name === UNKNOWN_COLLECTION_TITLE) return 1;
      if (b.name === UNKNOWN_COLLECTION_TITLE) return -1;
      return 0;
    });

  return grouped;
};
