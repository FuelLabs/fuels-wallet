import { cssObj } from '@fuel-ui/css';
import { BoxCentered, Button, Flex, Text } from '@fuel-ui/react';

import { useApplication } from '../hooks/useApplication';

import { useAccount } from '~/systems/Account';

export function AuthorizeApp() {
  const { authorizeApplication, isConnecting, origin } = useApplication();
  const { account } = useAccount();

  if (!account || !isConnecting) return null;

  return (
    <BoxCentered minHS={true} minWS={true} css={styles.boxCentered}>
      <Flex direction="column" justify="center" align="center">
        <Text css={{ marginBottom: '$2' }}>{origin || ''}</Text>
        <Button onPress={() => authorizeApplication([account.address])}>
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
