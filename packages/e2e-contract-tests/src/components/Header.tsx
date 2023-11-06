import {
  useConnect,
  FUEL_WALLET_CONNECTOR,
  useConnectors,
} from '@fuel-wallet/react';

export const Header = () => {
  const { connect } = useConnect();
  const { connectors } = useConnectors();

  return (
    <button
      disabled={!connectors.length}
      onClick={() => {
        connect(FUEL_WALLET_CONNECTOR.connector);
      }}
    >
      Connect
    </button>
  );
};
