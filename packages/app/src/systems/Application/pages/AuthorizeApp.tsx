import { BoxCentered, Button } from '@fuel-ui/react';

import { useApplication } from '../hooks/useApplication';

import { useAccount } from '~/systems/Account';

export function AuthorizeApp() {
  const { authorizeApplication, isConnecting } = useApplication();
  const { account } = useAccount();

  if (!account || !isConnecting) return null;

  return (
    <BoxCentered
      minHS={true}
      minWS={true}
      css={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        background: '$accent1',
      }}
    >
      <Button onPress={() => authorizeApplication([account.address])}>
        Authorize App
      </Button>
    </BoxCentered>
  );
}
