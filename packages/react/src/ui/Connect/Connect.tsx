import { cssObj } from '@fuel-ui/css';
import { Box, Dialog, Icon, IconButton, Text } from '@fuel-ui/react';

import { useConnector } from '../../components';

import { ConnectInstall } from './ConnectInstall';
import { ConnectList } from './ConnectList';

export const Connect = ({ theme }: { theme: string }) => {
  const {
    connectors,
    cancel,
    dialog: { isOpen, connector, connect, back },
  } = useConnector();

  return (
    <Dialog isOpen={isOpen} isBlocked={isOpen}>
      <Dialog.Content css={styles.content}>
        <Dialog.Heading as="div">
          <Box.HStack justify="space-between">
            <Box css={styles.headerAction}>
              {connector && (
                <IconButton
                  icon={Icon.is('ChevronLeft')}
                  aria-label="back"
                  variant="link"
                  onPress={back}
                />
              )}
            </Box>
            <Text fontSize="base" css={styles.headerTitle}>
              Connect Wallet
            </Text>
            <Box css={styles.headerAction}>
              <IconButton
                icon={Icon.is('X')}
                aria-label="close"
                variant="link"
                onPress={cancel}
              />
            </Box>
          </Box.HStack>
        </Dialog.Heading>
        {!connector ? (
          <ConnectList
            connectors={connectors}
            theme={theme}
            onPress={connect}
          />
        ) : (
          <ConnectInstall connector={connector} />
        )}
      </Dialog.Content>
    </Dialog>
  );
};

const styles = {
  headerTitle: cssObj({
    display: 'flex',
    alignItems: 'center',
  }),
  headerAction: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    with: '$2',
  }),
  content: cssObj({
    maxWidth: 300,
    backgroundColor: '$intentsBase1',
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
