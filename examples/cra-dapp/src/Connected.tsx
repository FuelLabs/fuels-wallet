import {
  useAccount,
  useAccounts,
  useDisconnect,
  useFuel,
  useNetwork,
  useNetworks,
  useSelectNetwork,
  useWallet,
} from '@fuels/react';

import { TESTNET_NETWORK_URL, bn } from 'fuels';
import './App.css';

export function Connected() {
  const { fuel } = useFuel();
  const { disconnect } = useDisconnect();
  const { wallet } = useWallet();
  const { account } = useAccount();
  const { accounts } = useAccounts();

  const { network } = useNetwork();
  const { networks } = useNetworks();
  const { selectNetworkAsync, isPending: isSelectingNetwork } =
    useSelectNetwork();

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
      </div>

      <br />
      <br />

      <div className="Actions">
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await selectNetworkAsync({
                chainId: 0,
              });
              console.log(res);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          {isSelectingNetwork ? 'Loading...' : 'Select chainId 0'}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await selectNetworkAsync({
                url: TESTNET_NETWORK_URL,
              });
              console.log(res);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          {isSelectingNetwork ? 'Loading...' : 'Select Testnet by URL'}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await selectNetworkAsync({
                chainId: 111,
              });
              console.log(res);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          {isSelectingNetwork ? 'Loading...' : 'Select Unknown ChainId'}
        </button>
      </div>

      <div className="Accounts">
        <h3>Current Network</h3>
        <div>
          <b>Chain Id:</b> {network?.chainId?.toString()}
        </div>
        <div>
          <b>Url:</b> {network?.url}
        </div>
      </div>

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
