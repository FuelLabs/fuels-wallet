import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { depositHalfAndExternalMint } from '../contract_interactions';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const ForwardHalfAndExternalMintCard = () => {
  const [forwardAmount, setForwardAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);
  const baseAssetId = useBaseAssetId();

  return (
    <div>
      <p>Forward Half and External Mint</p>
      <div aria-label="forward half and external mint card">
        <label>Forward Amount</label>
        <br />
        <input
          aria-label="Forward amount external mint"
          onChange={(event) => setForwardAmount(event.target.value)}
          value={forwardAmount}
        />
        <br />
        <label>Mint Amount</label>
        <br />
        <input
          aria-label="Mint amount external mint"
          onChange={(event) => setMintAmount(event.target.value)}
          value={mintAmount}
        />
        <br />
        <button
          type="button"
          disabled={!baseAssetId}
          onClick={async () => {
            if (baseAssetId && wallet.wallet && mintAmount && forwardAmount) {
              await depositHalfAndExternalMint({
                wallet: wallet.wallet,
                forwardAmount: bn.parseUnits(forwardAmount),
                mintAmount: bn.parseUnits(mintAmount, 1).div(10),
                assetId: baseAssetId,
                baseAssetId,
              });
            }
          }}
        >
          Forward Half And External Mint
        </button>
        <hr />
      </div>
    </div>
  );
};
