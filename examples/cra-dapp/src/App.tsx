import {
  useAccount,
  useAccounts,
  useConnectUI,
  useDisconnect,
  useFuel,
  useIsConnected,
  useWallet,
} from '@fuels/react';

import { bn } from 'fuels';
import './App.css';

function App() {
  const { connect, error, isError, theme, isConnecting } = useConnectUI();

  const { fuel } = useFuel();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const { account } = useAccount();
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
        <button
          type="button"
          onClick={async () => {
            const txn = await wallet?.createTransfer(
              'fuel1vvpwz92v0gkk5dct9lmgnee23h3uj2fts4rmghffdvv88hyxzqas587le2',
              bn(100),
              undefined,
              {
                tip: bn(10),
              }
            );

            if (!txn || !account) return;

            try {
              const result = await fuel.sendTransaction(account, txn);
              console.log(result);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Send transaction
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
