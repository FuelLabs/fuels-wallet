import { cssObj } from '@fuel-ui/css';
import { BoxCentered, Heading } from '@fuel-ui/react';

import { ImageLoader, relativeUrl } from '~/systems/Core';

type AssetsEmptyProps = {
  isDevnet?: boolean;
};

export function AssetListEmpty(_: AssetsEmptyProps) {
  return (
    <BoxCentered css={styles.empty}>
      <ImageLoader
        src={relativeUrl('/empty-assets.png')}
        width={183}
        height={144}
        alt="No assets"
        wrapperCSS={{ mb: '$5' }}
      />
      <Heading as="h5">You don&apos;t have any assets</Heading>
    </BoxCentered>
  );
}

const styles = {
  empty: cssObj({
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    textAlign: 'center',

    img: {
      transform: 'translateX(-10px)',
      mb: '$5',
    },

    h5: {
      margin: 0,
    },
    button: {
      mt: '$2',
    },
  }),
};
