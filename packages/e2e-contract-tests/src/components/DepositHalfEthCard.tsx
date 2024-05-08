import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { depositHalf } from '../contract_interactions';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const DepositHalfEthCard = () => {
  const [amount, setAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);
  const baseAssetId = useBaseAssetId();

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
          type="button"
          disabled={!baseAssetId}
          onClick={async () => {
            if (baseAssetId && wallet.wallet && amount) {
              await depositHalf({
                wallet: wallet.wallet,
                amount: bn.parseUnits(amount),
                assetId: baseAssetId,
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
