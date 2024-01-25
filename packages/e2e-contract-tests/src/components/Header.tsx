import { useConnectUI } from '@fuel-wallet/react';

export const Header = () => {
  const { connect } = useConnectUI();

  return <button onClick={connect}>Connect</button>;
};
