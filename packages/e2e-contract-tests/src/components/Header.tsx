import { useConnectors, useFuelConnect } from '@fuel-wallet/react';

export const Header = () => {
  const { connect } = useFuelConnect();
  const { connectors } = useConnectors();

  return (
    <button disabled={!connectors.length} onClick={connect}>
      Connect
    </button>
  );
};
