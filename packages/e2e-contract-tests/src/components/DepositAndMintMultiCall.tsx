import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { depositAndMintMultiCall } from '../contract_interactions';
import { useAction } from '../hooks/useAction';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const DepositAndMintMultiCalls = () => {
  const [forwardAmount, setForwardAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet({ account });
  const baseAssetId = useBaseAssetId();
  const { disabled, execute, error } = useAction({
    isValid: !!baseAssetId && !!wallet && !!forwardAmount && !!mintAmount,
    action: async () => {
      if (baseAssetId && wallet.wallet && mintAmount && forwardAmount) {
        await depositAndMintMultiCall({
          wallet: wallet.wallet!,
          forwardAmount: bn.parseUnits(forwardAmount),
          mintAmount: bn.parseUnits(mintAmount, 1).div(10),
          assetId: baseAssetId,
          baseAssetId,
        });
      }
    },
  });

  return (
    <div>
      <p>Deposit and Mint Multicall</p>
      <div aria-label="Deposit and mint multicall asset card">
        <label>Forward Amount</label>
        <br />
        <input
          aria-label="Forward amount multicall"
          onChange={(event) => {
            setForwardAmount(event.target.value);
          }}
          value={forwardAmount}
        />
        <br />
        <label>Mint Amount</label>
        <br />
        <input
          aria-label="Mint amount multicall"
          onChange={(event) => {
            setMintAmount(event.target.value);
          }}
          value={mintAmount}
        />
        <br />
        <button type="button" disabled={disabled} onClick={execute}>
          Deposit And Mint Multicall
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
