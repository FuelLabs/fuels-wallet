import { useAccount, useWallet } from '@fuel-wallet/react';
import { BaseAssetId, bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';

export const MintAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const { wallet } = useWallet({ address: account });

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
          onClick={async () => {
            if (wallet) {
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
