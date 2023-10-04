import { Nav } from '@fuel-ui/react';
import {
  useAccount,
  useConnect,
  FUEL_WALLET_CONNECTOR,
  FUEL_WALLET_DEVELOPMENT_CONNECTOR,
} from '@fuel-wallet/react';

import { IS_TEST } from '../config';

export const Header = () => {
  const connect = useConnect();
  const account = useAccount();

  return (
    <Nav
      account={account.account}
      onConnect={() =>
        connect.mutate(
          IS_TEST
            ? FUEL_WALLET_CONNECTOR.connector
            : FUEL_WALLET_DEVELOPMENT_CONNECTOR.connector
        )
      }
    >
      <Nav.Desktop>
        <Nav.Logo />
        <Nav.Spacer />
        <Nav.Connection />
      </Nav.Desktop>
    </Nav>
  );
};
