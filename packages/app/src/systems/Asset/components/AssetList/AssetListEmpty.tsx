import { cssObj } from '@fuel-ui/css';
import { Box, Button, Heading, Icon, Text } from '@fuel-ui/react';

import { ImageLoader, relativeUrl } from '~/systems/Core';
import { useOpenFaucet } from '~/systems/Faucet';

export type AssetListEmptyProps = {
  showFaucet?: boolean;
  text?: string;
  supportText?: string;
};

export function AssetListEmpty({
  showFaucet,
  text = `You don't have any assets`,
  supportText = 'Start depositing some assets',
}: AssetListEmptyProps) {
  const openFaucet = useOpenFaucet();

  return (
    <Box.Centered css={styles.empty}>
      <ImageLoader
        src={relativeUrl('/empty-assets.png')}
        width={150}
        height={120}
        alt="No assets"
        wrapperCSS={{ mb: '$5' }}
      />
      {!!text && <Heading as="h5">{text}</Heading>}
      {!!supportText && <Text fontSize="sm">{supportText}</Text>}
      {showFaucet && (
        /**
         * TODO: need to add right faucet icon on @fuel-ui
         */
        <Button size="sm" leftIcon={Icon.is('Wand')} onPress={openFaucet}>
          Faucet
        </Button>
      )}
    </Box.Centered>
  );
}

const styles = {
  faucet: {
    marginTop: '$4',
  },
  empty: cssObj({
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    textAlign: 'center',
    mt: '$3',
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
