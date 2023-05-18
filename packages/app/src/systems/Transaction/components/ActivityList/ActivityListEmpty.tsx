import { cssObj } from '@fuel-ui/css';
import { Text, BoxCentered, Heading, Button, Icon } from '@fuel-ui/react';

import { ImageLoader, relativeUrl } from '~/systems/Core';
import { useOpenFaucet } from '~/systems/Faucet';

type ActivityEmptyProps = {
  isDevnet?: boolean;
  bridgeUrl?: string;
};

export function ActivityListEmpty({ isDevnet }: ActivityEmptyProps) {
  const openFaucet = useOpenFaucet();
  return (
    <BoxCentered css={styles.empty}>
      <ImageLoader
        src={relativeUrl('/empty-activity.svg')}
        alt="No activity"
        width={250}
        height={208}
        wrapperCSS={{ mb: '$5', mt: '$16' }}
      />
      <Heading as="h5">No activity yet</Heading>
      <Text fontSize="sm" css={styles.text}>
        When you make a transaction you&apos;ll see it here
      </Text>
      {isDevnet && (
        /**
         * TODO: need to add right faucet icon on @fuel-ui
         */
        <Button size="sm" leftIcon={Icon.is('Coffee')} onPress={openFaucet}>
          Faucet
        </Button>
      )}
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
      mt: '$5',
    },

    h5: {
      margin: 0,
    },
  }),
  text: cssObj({
    fontWeight: '500',
  }),
};
