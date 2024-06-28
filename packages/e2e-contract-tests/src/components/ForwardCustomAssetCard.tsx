import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { MAIN_CONTRACT_ID } from '../config';
import { deposit } from '../contract_interactions';
import { useBaseAssetId } from '../hooks/useBaseAssetId';
import { calculateAssetId } from '../utils';

export const ForwardCustomAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);

  const baseAssetId = useBaseAssetId();
  const assetId =
    !!baseAssetId && calculateAssetId(MAIN_CONTRACT_ID, baseAssetId);

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
        <button
          type="button"
          disabled={!assetId}
          onClick={async () => {
            if (assetId && wallet.wallet && amount) {
              await deposit({
                wallet: wallet.wallet,
                amount: bn.parseUnits(amount),
                assetId,
              });
            }
          }}
        >
          Forward Custom Asset
        </button>
        <hr />
      </div>
    </div>
  );
};
