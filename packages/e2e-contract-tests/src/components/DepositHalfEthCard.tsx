import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { depositHalf } from '../contract_interactions';
import { useAction } from '../hooks/useAction';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const DepositHalfEthCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet({ account });
  const baseAssetId = useBaseAssetId();
  const { disabled, execute, error } = useAction({
    isValid: !!baseAssetId && !!wallet && !!amount,
    action: async () => {
      if (baseAssetId && wallet.wallet && amount) {
        await depositHalf({
          wallet: wallet.wallet!,
          amount: bn.parseUnits(amount),
          assetId: baseAssetId,
        });
      }
    },
  });

  return (
    <div>
      <p>Deposit Half Eth</p>
      <div aria-label="Deposit half eth card">
        <label>Amount</label>
        <br />
        <input
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          value={amount}
        />
        <br />
        <button type="button" disabled={disabled} onClick={execute}>
          Deposit Half ETH
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
