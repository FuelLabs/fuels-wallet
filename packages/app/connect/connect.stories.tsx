import { cssObj } from '@fuel-ui/css';
import { Box, Button, Text } from '@fuel-ui/react';
import { FuelProvider, useAccount, useConnectUI } from '@fuels/react';
import { useDarkMode } from 'storybook-dark-mode';

export default {
  component: FuelProvider,
  title: 'Connect',
  parameters: {
    layout: 'fullscreen',
  },
};

const App = () => {
  const { account } = useAccount();
  const { connect, isConnecting } = useConnectUI();

  return (
    <>
      <Button onPress={connect}>
        {isConnecting ? 'Connecting' : 'Connect Wallet'}
      </Button>
      <Text>{account}</Text>
    </>
  );
};

export const Usage = () => {
  const isDark = useDarkMode();
  return (
    <Box css={styles.box}>
      <FuelProvider>
        <FuelProvider theme={isDark ? 'dark' : 'light'}>
          <App />
        </FuelProvider>
      </FuelProvider>
    </Box>
  );
};

const styles = {
  box: cssObj({
    '.DialogContent': {
      backgroundColor: 'red !important',
    },
  }),
};
