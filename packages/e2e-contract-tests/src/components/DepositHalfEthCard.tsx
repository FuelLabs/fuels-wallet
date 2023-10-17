import { useAccount, useWallet } from '@fuel-wallet/react';
import { BaseAssetId, bn } from 'fuels';
import { useState } from 'react';

import { depositHalf } from '../contract_interactions';

export const DepositHalfEthCard = () => {
  const [amount, setAmount] = useState<string>('');
  const account = useAccount();
  const wallet = useWallet({ address: account.account });

  return (
    <div>
      <p>Deposit Half Eth</p>
      <div aria-label="Deposit half eth card">
        <input
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          value={amount}
        />
        <button
          onClick={async () => {
            if (wallet.wallet && amount) {
              await depositHalf({
                wallet: wallet.wallet,
                amount: bn.parseUnits(amount),
                assetId: BaseAssetId,
              });
            }
          }}
        >
          Deposit Half ETH
        </button>
      </div>
    </div>
  );
};
