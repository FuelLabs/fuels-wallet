import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';
import { getBaseAssetId } from '../utils';

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
                subId: getBaseAssetId(),
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
