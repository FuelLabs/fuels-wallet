import { cssObj } from '@fuel-ui/css';
import { Box, CardList, Image, Text } from '@fuel-ui/react';

import type { Connector, ConnectorList } from '../../types';

import { getImageUrl } from './utils/getImageUrl';

export type ConnectListProps = {
  theme: string;
  connectors: ConnectorList;
  onPress: (connector: Connector) => void;
};

export const ConnectList = ({
  connectors,
  theme,
  onPress,
}: ConnectListProps) => {
  return (
    <CardList>
      {connectors.map((connector, index) => (
        <CardList.Item
          variant="ghost"
          key={connector.connector}
          onPress={() => onPress(connector)}
          aria-label={`Connect to ${connector.name}}`}
          data-theme={theme}
          css={styles.connector}
          tabIndex={index}
        >
          <Box css={styles.connectorImage}>
            {getImageUrl(theme, connector) && (
              <Image
                src={getImageUrl(theme, connector)}
                alt={`${connector.name} logo`}
              />
            )}
          </Box>
          <Text>{connector.name}</Text>
        </CardList.Item>
      ))}
    </CardList>
  );
};

const styles = {
  connector: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',

    '&[data-theme="dark"]': {
      border: 0,
      backgroundColor: '$intentsBase2',
    },

    '&:hover': {
      backgroundColor: '$intentsBase3',
    },
  }),
  connectorImage: cssObj({
    height: '$8',
    width: '$8',
    '& > img': {
      maxHeight: '$full',
      width: '$full',
    },
  }),
};
