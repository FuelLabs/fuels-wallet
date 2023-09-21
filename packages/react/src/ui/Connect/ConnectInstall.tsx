import { cssObj } from '@fuel-ui/css';
import { Box, Button, Image, Text, useFuelTheme } from '@fuel-ui/react';

import type { Connector } from '../../types';

import { getImageUrl } from './utils/getImageUrl';

type ConnectInstallProps = {
  connector: Connector;
};

export const ConnectInstall = ({ connector }: ConnectInstallProps) => {
  const { current } = useFuelTheme();

  return (
    <Box.Stack>
      <Box css={styles.connectorImage}>
        <Image
          src={getImageUrl(current, connector)}
          alt={`${connector.name} logo`}
        />
      </Box>
      <Text fontSize="lg" css={styles.connectorTitle}>
        {connector.install.action} {connector.name}
      </Text>
      <Text css={styles.connectorDescription}>
        {connector.install.description}
      </Text>
      <Box css={styles.connectorFooter}>
        <Button
          size="lg"
          variant="ghost"
          as="a"
          href={connector.install.link}
          target="_blank"
        >
          <b>{connector.install.action}</b>
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
