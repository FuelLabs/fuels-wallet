import { useAccount, useWallet } from '@fuel-wallet/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';

export const MintAssetCard = () => {
  const [amount, setAmount] = useState<string>('');
  const account = useAccount();
  const wallet = useWallet({ address: account.account });

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
            if (wallet.wallet && amount) {
              await mint({
                wallet: wallet.wallet,
                amount: bn.parseUnits(amount),
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
