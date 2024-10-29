import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { depositHalfAndMint } from '../contract_interactions';
import { useAction } from '../hooks/useAction';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const ForwardHalfAndMintCard = () => {
  const [forwardAmount, setForwardAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet({ account });
  const baseAssetId = useBaseAssetId();

  const { disabled, execute, error } = useAction({
    isValid: !!baseAssetId && !!wallet && !!forwardAmount && !!mintAmount,
    action: async () => {
      await depositHalfAndMint({
        wallet: wallet.wallet!,
        forwardAmount: bn.parseUnits(forwardAmount),
        mintAmount: bn.parseUnits(mintAmount, 1).div(10),
        assetId: baseAssetId,
        baseAssetId,
      });
    },
  });

  return (
    <div>
      <p>Forward Half and Mint</p>
      <div aria-label="forward half and mint card">
        <label>Forward amount</label>
        <br />
        <input
          aria-label="Forward amount"
          onChange={(event) => setForwardAmount(event.target.value)}
          value={forwardAmount}
        />
        <br />
        <label>Mint amount</label>
        <br />
        <input
          aria-label="Mint amount"
          onChange={(event) => setMintAmount(event.target.value)}
          value={mintAmount}
        />
        <br />
        <button type="button" disabled={disabled} onClick={execute}>
          Forward Half And Mint
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
