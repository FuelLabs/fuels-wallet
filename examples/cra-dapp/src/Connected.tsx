import {
  useAccount,
  useAccounts,
  useAddNetwork,
  useConnectUI,
  useDisconnect,
  useFuel,
  useNetworks,
  useWallet,
} from '@fuels/react';

import { TESTNET_NETWORK_URL, bn } from 'fuels';
import './App.css';

export function Connected() {
  const { error, isError } = useConnectUI();

  const { fuel } = useFuel();
  const { disconnect } = useDisconnect();
  const { wallet } = useWallet();
  const { account } = useAccount();
  const { accounts } = useAccounts();
  const { networks } = useNetworks();
  const { addNetworkAsync } = useAddNetwork();

  return (
    <div>
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
      <div className="Accounts">
        <h3>Connected accounts</h3>
        {accounts?.map((account) => (
          <div key={account}>
            <b>Account:</b> {account}
          </div>
        ))}
      </div>
      <div className="Accounts">
        <h3>Networks</h3>
        {networks?.map((network) => (
          <div key={network.url}>
            <b>{network.chainId}:</b> {network.url}
          </div>
        ))}
      </div>
    </div>
  );
}
