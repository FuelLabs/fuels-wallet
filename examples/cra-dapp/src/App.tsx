import {
  useAccount,
  useAccounts,
  useAddNetwork,
  useConnectUI,
  useDisconnect,
  useFuel,
  useIsConnected,
  useWallet,
} from '@fuels/react';

import { TESTNET_NETWORK_URL, bn } from 'fuels';
import './App.css';

function App() {
  const { connect, error, isError, theme, isConnecting } = useConnectUI();

  const { fuel } = useFuel();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const { account } = useAccount();
  const { accounts } = useAccounts();
  const { addNetworkAsync } = useAddNetwork();

  if (!isConnected) {
    return (
      <div className="App" data-theme={theme}>
        <div className="Actions">
          <button
            type="button"
            onClick={() => {
              connect();
            }}
          >
            {isConnecting ? 'Connecting' : 'Connect'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App" data-theme={theme}>
      <div className="Actions">
        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
        <button
          type="button"
          onClick={async () => {
            const txn = await wallet?.createTransfer(
              '0xed73857a06ba2a706700e4e69e59f63a012ae6663a54309043e8fdc690bed926',
              bn(100),
              undefined,
              {
                tip: bn(2000),
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
          Send transaction with custom fees
        </button>
        <button
          type="button"
          onClick={async () => {
            const txn = await wallet?.createTransfer(
              '0xed73857a06ba2a706700e4e69e59f63a012ae6663a54309043e8fdc690bed926',
              bn(100),
              undefined,
              undefined
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
          Send transaction with default fees
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              addNetworkAsync(TESTNET_NETWORK_URL);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Switch to Testnet
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
