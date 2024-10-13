import { cssObj } from '@fuel-ui/css';
import { Box, Button, Heading, Icon, Text, useFuelTheme } from '@fuel-ui/react';
import { ImageLoader, relativeUrl } from '~/systems/Core';
import { useFundWallet } from '~/systems/FundWallet';

export function ActivityListEmpty() {
  const { open, showFund, hasFaucet } = useFundWallet();
  const { current: theme } = useFuelTheme();
  return (
    <Box.Centered css={styles.empty}>
      <ImageLoader
        src={relativeUrl(`/empty_activity_${theme}.png`)}
        alt="No activity"
        width={231}
        height={175}
        wrapperCSS={{ mb: '$5', mt: '$16' }}
      />
      <Heading as="h5">No activity yet</Heading>
      <Text fontSize="sm">
        When you make a transaction you&apos;ll see it here
      </Text>
      {showFund && (
        /**
         * TODO: need to add right faucet icon on @fuel-ui
         */
        <Button
          size="sm"
          leftIcon={hasFaucet ? Icon.is('Wand') : Icon.is('Bridge')}
          onPress={open}
          css={{ mt: '$4' }}
        >
          {hasFaucet ? 'Faucet' : 'Bridge to Fuel'}
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

    h5: {
      margin: 0,
    },
  }),
};
