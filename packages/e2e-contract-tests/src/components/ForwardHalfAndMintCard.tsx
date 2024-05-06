import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { depositHalfAndMint } from '../contract_interactions';
import { getBaseAssetId } from '../utils';

export const ForwardHalfAndMintCard = () => {
  const [forwardAmount, setForwardAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);

  return (
    <div>
      <p>Forward Half and Mint</p>
      <div aria-label="forward half and mint card">
        <input
          aria-label="Forward amount"
          onChange={(event) => setForwardAmount(event.target.value)}
          value={forwardAmount}
        />
        <input
          aria-label="Mint amount"
          onChange={(event) => setMintAmount(event.target.value)}
          value={mintAmount}
        />
        <button
          type="button"
          onClick={async () => {
            if (wallet.wallet && mintAmount && forwardAmount) {
              await depositHalfAndMint({
                wallet: wallet.wallet,
                forwardAmount: bn.parseUnits(forwardAmount),
                mintAmount: bn.parseUnits(mintAmount),
                assetId: getBaseAssetId(),
              });
            }
          }}
        >
          Forward Half And Mint
        </button>
      </div>
    </div>
  );
};
