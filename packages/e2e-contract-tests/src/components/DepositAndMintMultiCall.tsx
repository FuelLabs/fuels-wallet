import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { depositAndMintMultiCall } from '../contract_interactions';
import { useBaseAssetId } from '../hooks/useBaseAssetId';

export const DepositAndMintMultiCalls = () => {
  const [forwardAmount, setForwardAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);
  const baseAssetId = useBaseAssetId();

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
        <button
          type="button"
          disabled={!baseAssetId}
          onClick={async () => {
            if (baseAssetId && wallet.wallet && mintAmount && forwardAmount) {
              await depositAndMintMultiCall({
                wallet: wallet.wallet,
                forwardAmount: bn.parseUnits(forwardAmount),
                mintAmount: bn.parseUnits(mintAmount, 1).mul(10),
                assetId: baseAssetId,
                baseAssetId,
              });
            }
          }}
        >
          Deposit And Mint Multicall
        </button>
        <hr />
      </div>
    </div>
  );
};
