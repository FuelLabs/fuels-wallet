import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { deposit } from '../contract_interactions';
import { getBaseAssetId } from '../utils';

export const ForwardEthCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);

  return (
    <div>
      <p>Forward ETH</p>
      <div aria-label="forward eth card">
        <input
          onChange={(event) => setAmount(event.target.value)}
          value={amount}
        />
        <button
          type="button"
          onClick={async () => {
            if (wallet.wallet && amount) {
              await deposit({
                wallet: wallet.wallet,
                amount: bn.parseUnits(amount),
                assetId: getBaseAssetId(),
              });
            }
          }}
        >
          Forward ETH
        </button>
      </div>
    </div>
  );
};
