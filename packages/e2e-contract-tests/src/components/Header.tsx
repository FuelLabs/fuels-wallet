import { useConnectUI } from '@fuels/react';

export const Header = () => {
  const { connect } = useConnectUI();

  return <button onClick={connect}>Connect</button>;
};
