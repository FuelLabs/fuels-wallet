import { useAccount, useWallet } from '@fuels/react';
import { BaseAssetId, bn } from 'fuels';
import { useState } from 'react';

import { depositAndMintMultiCall } from '../contract_interactions';

export const DepositAndMintMultiCalls = () => {
  const [forwardAmount, setForwardAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const { account } = useAccount();
  const wallet = useWallet(account);

  return (
    <div>
      <p>Deposit and Mint Multicall</p>
      <div aria-label="Deposit and mint multicall asset card">
        <input
          aria-label="Forward amount multicall"
          onChange={(event) => {
            setForwardAmount(event.target.value);
          }}
          value={forwardAmount}
        />
        <input
          aria-label="Mint amount multicall"
          onChange={(event) => {
            setMintAmount(event.target.value);
          }}
          value={mintAmount}
        />
        <button
          onClick={async () => {
            if (wallet.wallet && mintAmount && forwardAmount) {
              await depositAndMintMultiCall({
                wallet: wallet.wallet,
                forwardAmount: bn.parseUnits(forwardAmount),
                mintAmount: bn.parseUnits(mintAmount),
                assetId: BaseAssetId,
              });
            }
          }}
        >
          Deposit And Mint Multicall
        </button>
      </div>
    </div>
  );
};
