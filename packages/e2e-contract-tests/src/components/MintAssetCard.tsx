import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const MintAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const { wallet } = useWallet(account);
  const baseAssetId = useBaseAssetId();

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
        <button
          type="button"
          disabled={!baseAssetId}
          onClick={async () => {
            if (baseAssetId && wallet && amount) {
              await mint({
                wallet,
                amount: bn.parseUnits(amount, 1).div(10),
                subId: baseAssetId,
              });
            }
          }}
        >
          Mint
        </button>
        <hr />
      </div>
    </div>
  );
};
