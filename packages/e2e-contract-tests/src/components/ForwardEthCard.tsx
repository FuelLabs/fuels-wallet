import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { deposit } from '../contract_interactions';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const ForwardEthCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);
  const baseAssetId = useBaseAssetId();

  return (
    <div>
      <p>Forward ETH</p>
      <div aria-label="forward eth card">
        <label>Amount</label>
        <br />
        <input
          onChange={(event) => setAmount(event.target.value)}
          value={amount}
        />
        <br />
        <button
          type="button"
          disabled={!baseAssetId}
          onClick={async () => {
            if (baseAssetId && wallet.wallet && amount) {
              await deposit({
                wallet: wallet.wallet,
                amount: bn.parseUnits(amount),
                assetId: baseAssetId,
              });
            }
          }}
        >
          Forward ETH
        </button>
        <hr />
      </div>
    </div>
  );
};
