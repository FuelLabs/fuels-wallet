import { useAccount, useWallet } from '@fuel-wallet/react';
import { BaseAssetId, bn } from 'fuels';
import { useState } from 'react';

import { MAIN_CONTRACT_ID } from '../config';
import { depositHalf } from '../contract_interactions';
import { calculateAssetId } from '../utils';

export const ForwardHalfCustomAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);

  const assetId = calculateAssetId(MAIN_CONTRACT_ID, BaseAssetId);

  return (
    <div>
      <p>Forward Half Custom Asset</p>
      <div aria-label="forward half custom asset card">
        <input
          onChange={(event) => setAmount(event.target.value)}
          value={amount}
        />
        <button
          onClick={async () => {
            if (wallet.wallet && amount) {
              await depositHalf({
                wallet: wallet.wallet,
                amount: bn.parseUnits(amount),
                assetId,
              });
            }
          }}
        >
          Forward Half Custom Asset
        </button>
      </div>
    </div>
  );
};
