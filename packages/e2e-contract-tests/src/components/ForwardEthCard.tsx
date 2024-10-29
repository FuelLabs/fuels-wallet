import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { deposit } from '../contract_interactions';
import { useAction } from '../hooks/useAction';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const ForwardEthCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet({ account });
  const baseAssetId = useBaseAssetId();

  const { disabled, execute, error } = useAction({
    isValid: !!baseAssetId && !!wallet && !!amount,
    action: async () => {
      await deposit({
        wallet: wallet.wallet!,
        amount: bn.parseUnits(amount),
        assetId: baseAssetId,
      });
    },
  });

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
        <button type="button" disabled={disabled} onClick={execute}>
          Forward ETH
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
