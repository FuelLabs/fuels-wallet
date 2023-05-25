import { cssObj } from '@fuel-ui/css';
import { Text, Heading, Button, Icon, Box } from '@fuel-ui/react';

import { ImageLoader, relativeUrl } from '~/systems/Core';
import { useOpenFaucet } from '~/systems/Faucet';

type ActivityEmptyProps = {
  isDevnet?: boolean;
  bridgeUrl?: string;
};

export function ActivityListEmpty({ isDevnet }: ActivityEmptyProps) {
  const openFaucet = useOpenFaucet();
  return (
    <Box.Centered css={styles.empty}>
      <ImageLoader
        src={relativeUrl('/empty-activity.svg')}
        alt="No activity"
        width={250}
        height={208}
        wrapperCSS={{ mb: '$5', mt: '$16' }}
      />
      <Heading as="h5">No activity yet</Heading>
      <Text fontSize="sm">
        When you make a transaction you&apos;ll see it here
      </Text>
      {isDevnet && (
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
  empty: cssObj({
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    textAlign: 'center',

    img: {
      transform: 'translateX(-10px)',
      mb: '$5',
      mt: '$5',
    },

    h5: {
      margin: 0,
    },
  }),
};
