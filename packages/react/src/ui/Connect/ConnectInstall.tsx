import { cssObj } from '@fuel-ui/css';
import { Box, Button, Image, Text, useFuelTheme } from '@fuel-ui/react';
import type { FuelConnector } from '@fuel-wallet/sdk';

import { getImageUrl } from './utils/getImageUrl';

type ConnectInstallProps = {
  connector: FuelConnector;
};

export const ConnectInstall = ({ connector }: ConnectInstallProps) => {
  const { current } = useFuelTheme();
  const {
    metadata: { install },
  } = connector;

  return (
    <Box.Stack>
      <Box css={styles.connectorImage}>
        <Image
          src={getImageUrl(current, connector)}
          alt={`${connector.name} logo`}
        />
      </Box>
      <Text fontSize="lg" css={styles.connectorTitle}>
        {install.action} {connector.name}
      </Text>
      <Text css={styles.connectorDescription}>{install.description}</Text>
      <Box css={styles.connectorFooter}>
        <Button
          size="lg"
          variant="ghost"
          as="a"
          href={install.link}
          target="_blank"
        >
          <b>{install.action}</b>
        </Button>
      </Box>
    </Box.Stack>
  );
};

const styles = {
  connectorTitle: cssObj({
    textAlign: 'center',
  }),
  connectorImage: cssObj({
    my: '$4',
    height: '$28',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '$full',

    '& > img': {
      maxHeight: '$full',
      width: '$full',
    },
  }),
  connectorDescription: cssObj({
    fontWeight: '$normal',
    textAlign: 'center',
    color: '$intentsBase9',
  }),
  connectorFooter: cssObj({
    mt: '$6',

    '& > .fuel_Button': {
      boxSizing: 'border-box',
      width: '$full',
    },
  }),
};
