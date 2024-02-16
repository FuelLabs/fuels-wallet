import { useAccount, useWallet } from '@fuels/react';
import { BaseAssetId, bn } from 'fuels';
import { useState } from 'react';

import { depositHalfAndExternalMint } from '../contract_interactions';

export const ForwardHalfAndExternalMintCard = () => {
  const [forwardAmount, setForwardAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);

  return (
    <div>
      <p>Forward Half and External Mint</p>
      <div aria-label="forward half and external mint card">
        <input
          aria-label="Forward amount external mint"
          onChange={(event) => setForwardAmount(event.target.value)}
          value={forwardAmount}
        />
        <input
          aria-label="Mint amount external mint"
          onChange={(event) => setMintAmount(event.target.value)}
          value={mintAmount}
        />
        <button
          onClick={async () => {
            if (wallet.wallet && mintAmount && forwardAmount) {
              await depositHalfAndExternalMint({
                wallet: wallet.wallet,
                forwardAmount: bn.parseUnits(forwardAmount),
                mintAmount: bn.parseUnits(mintAmount),
                assetId: BaseAssetId,
              });
            }
          }}
        >
          Forward Half And External Mint
        </button>
      </div>
    </div>
  );
};
