import { cssObj } from '@fuel-ui/css';
import { Box, Tag } from '@fuel-ui/react';
import { useAssets } from '@fuels/react';

import { ExampleBox } from '../../../src/components/ExampleBox';
import { getAssetByChain } from '../../../src/utils/getAssetByChain';

export function ListAssetsHook() {
  /* useAssets:start */
  const { assets } = useAssets();
  /* useAssets:end */

  return (
    <ExampleBox>
      <Box.Stack css={styles.root}>
        {Boolean(assets.length) && (
          <Box.Stack gap="$1" css={{ mt: '$2' }}>
            {assets.map((a) => {
              const asset = getAssetByChain(a, 0);
              if (!asset) return null;

              return (
                <Tag size="xs" variant="ghost" key={JSON.stringify(asset)}>
                  {asset?.name} ({asset?.symbol}){/* : {asset.assetId} */}
                </Tag>
              );
            })}
          </Box.Stack>
        )}
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    display: 'inline-flex',
    alignItems: 'flex-start',

    '.fuel_Tag': {
      justifyContent: 'flex-start',

      '& > p': {
        fontSize: '$sm',
      },
    },
  }),
};
