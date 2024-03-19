import { useConnectUI } from '@fuels/react';

export const Header = () => {
  const { connect } = useConnectUI();

  return (
    <button type="button" onClick={connect}>
      Connect
    </button>
  );
};
