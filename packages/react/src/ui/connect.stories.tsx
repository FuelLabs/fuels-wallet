import { cssObj } from '@fuel-ui/css';
import { Box, Button, Text } from '@fuel-ui/react';

import {
  FuelProvider,
  useAccount,
  useConnector,
  Connect,
  FuelConnectorProvider,
} from '../index';

export default {
  component: Connect,
  title: 'Connect',
  parameters: {
    layout: 'fullscreen',
  },
};

const FuelContainer = () => {
  const { account } = useAccount();
  const { connect, isConnecting } = useConnector();

  return (
    <>
      <Button onPress={connect}>
        {isConnecting ? 'Connecting' : 'Connect Wallet'}
      </Button>
      <Text>{account}</Text>
    </>
  );
};

export const Usage = () => (
  <FuelProvider>
    <FuelConnectorProvider theme="dark">
      <Box.Stack align="center" justify="center" css={styles.storybook}>
        <FuelContainer />
      </Box.Stack>
    </FuelConnectorProvider>
  </FuelProvider>
);

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
