import {
  useConnect,
  FUEL_WALLET_CONNECTOR,
  FUEL_WALLET_DEVELOPMENT_CONNECTOR,
} from '@fuel-wallet/react';

import { IS_TEST } from '../config';

export const Header = () => {
  const { connect } = useConnect();

  return (
    <button
      onClick={() => {
        connect(
          IS_TEST
            ? FUEL_WALLET_CONNECTOR.connector
            : FUEL_WALLET_DEVELOPMENT_CONNECTOR.connector
        );
      }}
    >
      Connect
    </button>
  );
};
