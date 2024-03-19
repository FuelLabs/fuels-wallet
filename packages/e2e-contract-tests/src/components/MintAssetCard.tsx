import { useAccount, useWallet } from '@fuels/react';
import { BaseAssetId, bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';

export const MintAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const { wallet } = useWallet(account);

  return (
    <div>
      <p>Mint Custom Asset</p>
      <div aria-label="Mint asset card">
        <input
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          value={amount}
        />
        <button
          type="button"
          onClick={async () => {
            if (wallet && amount) {
              await mint({
                wallet,
                amount: bn.parseUnits(amount),
                subId: BaseAssetId,
              });
            }
          }}
        >
          Mint
        </button>
      </div>
    </div>
  );
};
