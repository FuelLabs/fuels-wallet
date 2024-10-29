import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { MAIN_CONTRACT_ID } from '../config';
import { deposit } from '../contract_interactions';
import { useAction } from '../hooks/useAction';
import { useBaseAssetId } from '../hooks/useBaseAssetId';
import { calculateAssetId } from '../utils';

export const ForwardCustomAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet({ account });

  const baseAssetId = useBaseAssetId();
  const assetId =
    !!baseAssetId && calculateAssetId(MAIN_CONTRACT_ID, baseAssetId);
  const { disabled, execute, error } = useAction({
    isValid: !!baseAssetId && !!wallet && !!amount,
    action: async () => {
      if (assetId && wallet.wallet && amount) {
        await deposit({
          wallet: wallet.wallet!,
          amount: bn.parseUnits(amount, 1).div(10),
          assetId,
        });
      }
    },
  });

  return (
    <div>
      <p>Forward Custom Asset</p>
      <div aria-label="forward custom asset card">
        <label>Amount</label>
        <br />
        <input
          onChange={(event) => setAmount(event.target.value)}
          value={amount}
        />
        <br />
        <button type="button" disabled={disabled} onClick={execute}>
          Forward Custom Asset
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
