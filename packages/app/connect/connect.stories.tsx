import { cssObj } from '@fuel-ui/css';
import { Box, Button, Text } from '@fuel-ui/react';
import {
  Connect,
  FuelProvider,
  FuelConnectProvider,
  useAccount,
  useFuelConnect,
} from '@fuel-wallet/react';
import { useDarkMode } from 'storybook-dark-mode';

export default {
  component: Connect,
  title: 'Connect',
  parameters: {
    layout: 'fullscreen',
  },
};

const App = () => {
  const { account } = useAccount();
  const { connect, isConnecting } = useFuelConnect();

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
        <FuelConnectProvider theme={isDark ? 'dark' : 'light'}>
          <App />
        </FuelConnectProvider>
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
