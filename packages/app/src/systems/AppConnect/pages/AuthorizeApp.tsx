import { cssObj } from '@fuel-ui/css';
import { BoxCentered, Button, Flex, Text } from '@fuel-ui/react';

import { useAppConnect } from '../hooks/useAppConnect';

import { useAccount } from '~/systems/Account';

export function AuthorizeApp() {
  const { handlers, isConnecting, origin } = useAppConnect();
  const { account } = useAccount();

  if (!account || !isConnecting) return null;

  return (
    <BoxCentered minHS={true} minWS={true} css={styles.boxCentered}>
      <Flex direction="column" justify="center" align="center">
        <Text css={{ marginBottom: '$2' }}>{origin || ''}</Text>
        <Button
          onPress={() => handlers.authorizeApplication([account.address])}
        >
          Authorize
        </Button>
      </Flex>
    </BoxCentered>
  );
}

const styles = {
  boxCentered: cssObj({
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 99999,
    background: '$accent1',
  }),
};
