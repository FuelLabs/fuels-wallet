import { useAccount, useWallet } from '@fuels/react';

import { panicTx, revertTx } from '../contract_interactions';

export const RevertCard = () => {
  const { account } = useAccount();
  const { wallet } = useWallet(account);

  return (
    <div>
      <p>Panic TX</p>
      <div aria-label="Panic asset card">
        <button
          onClick={async () => {
            if (wallet) {
              await panicTx({
                wallet,
              });
            }
          }}
        >
          Panic
        </button>
      </div>
      <p>Revert TX</p>
      <div aria-label="Revert asset card">
        <button
          onClick={async () => {
            if (wallet) {
              await revertTx({
                wallet,
              });
            }
          }}
        >
          Revert
        </button>
      </div>
    </div>
  );
};
