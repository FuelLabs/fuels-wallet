/* eslint-disable no-console */
import {
  useAccounts,
  useDisconnect,
  useConnectUI,
  useIsConnected,
} from '@fuel-wallet/react';
import './App.css';

function App() {
  const { connect, error, isError, theme, setTheme, isConnecting } =
    useConnectUI();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { accounts } = useAccounts();
  const lightTheme = theme === 'light';

  return (
    <div className="App" data-theme={theme}>
      <div className="Actions">
        <button
          onClick={() => {
            console.log('connect');
            connect();
          }}
        >
          {isConnecting ? 'Connecting' : 'Connect'}
        </button>
        {isConnected && (
          <button onClick={() => disconnect()}>Disconnect</button>
        )}
        <button onClick={() => setTheme(lightTheme ? 'dark' : 'light')}>
          {lightTheme ? '🌙' : '☀️'}
        </button>
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
