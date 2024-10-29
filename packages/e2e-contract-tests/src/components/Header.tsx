import { useConnectUI } from '@fuels/react';

export const Header = () => {
  const { connect, isConnected } = useConnectUI();

  return (
    <>
      <button type="button" onClick={connect}>
        {isConnected ? 'Reconnect' : 'Connect'}
      </button>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </>
  );
};
