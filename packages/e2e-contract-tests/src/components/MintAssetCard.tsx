import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';
import { useAction } from '../hooks/useAction';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const MintAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const { wallet } = useWallet({ account });
  const baseAssetId = useBaseAssetId();

  const { disabled, execute, error } = useAction({
    isValid: !!baseAssetId && !!wallet && !!amount,
    action: async () => {
      await mint({
        wallet: wallet!,
        amount: bn.parseUnits(amount, 1).div(10),
        subId: baseAssetId,
      });
    },
  });

  return (
    <div>
      <p>Mint Custom Asset</p>
      <div aria-label="Mint asset card">
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
          Mint
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
