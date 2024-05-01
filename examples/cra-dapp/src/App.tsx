import {
  useAccounts,
  useConnectUI,
  useDisconnect,
  useIsConnected,
} from '@fuels/react';

import './App.css';

function App() {
  const { connect, error, isError, theme, isConnecting } = useConnectUI();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { accounts } = useAccounts();

  return (
    <div className="App" data-theme={theme}>
      <div className="Actions">
        <button
          type="button"
          onClick={() => {
            console.log('connect');
            connect();
          }}
        >
          {isConnecting ? 'Connecting' : 'Connect'}
        </button>
        {isConnected && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>
      {isError && <p className="Error">{error?.message}</p>}
      {isConnected && (
        <div className="Accounts">
          <h3>Connected accounts</h3>
          {accounts?.map((account) => (
            <div key={account}>
              <b>Account:</b> {account}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
