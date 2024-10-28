import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { MAIN_CONTRACT_ID } from '../config';
import { depositHalf } from '../contract_interactions';
import { useAction } from '../hooks/useAction';
import { useBaseAssetId } from '../hooks/useBaseAssetId';
import { calculateAssetId } from '../utils';

export const ForwardHalfCustomAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet({ account });

  const baseAssetId = useBaseAssetId();
  const { disabled, execute, error } = useAction({
    isValid: !!baseAssetId && !!wallet && !!amount,
    action: async () => {
      if (assetId && wallet.wallet && amount) {
        await depositHalf({
          wallet: wallet.wallet!,
          amount: bn.parseUnits(amount, 1).div(10),
          assetId,
        });
      }
    },
  });

  const assetId =
    !!baseAssetId && calculateAssetId(MAIN_CONTRACT_ID, baseAssetId);

  return (
    <div>
      <p>Forward Half Custom Asset</p>
      <div aria-label="forward half custom asset card">
        <label>Amount</label>
        <br />
        <input
          onChange={(event) => setAmount(event.target.value)}
          value={amount}
        />
        <br />
        <button type="button" disabled={disabled} onClick={execute}>
          Forward Half Custom Asset
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
