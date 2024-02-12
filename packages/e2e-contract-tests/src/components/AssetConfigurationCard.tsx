import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';

export const AssetConfigurationCard = () => {
  const [assetData, setAssetData] = useState({
    amount: '',
    subId: '',
    decimals: '',
  });
  const { account } = useAccount();
  const wallet = useWallet(account);

  return (
    <div>
      <p>Asset Configuration</p>
      <div>
        <input
          aria-label="Asset config amount"
          value={assetData.amount}
          onChange={(event) =>
            setAssetData({ ...assetData, amount: event.target.value })
          }
        />
        <input
          aria-label="Asset config subid"
          value={assetData.subId}
          onChange={(event) =>
            setAssetData({ ...assetData, subId: event.target.value })
          }
        />
        <input
          aria-label="Asset config decimals"
          value={assetData.decimals}
          onChange={(event) =>
            setAssetData({ ...assetData, decimals: event.target.value })
          }
        />
        <button
          onClick={async () => {
            if (wallet.wallet) {
              await mint({
                wallet: wallet.wallet,
                amount: bn.parseUnits(
                  assetData.amount,
                  Number(assetData.decimals)
                ),
                subId: assetData.subId,
              });
            }
          }}
        >
          Mint Asset configuration
        </button>
      </div>
    </div>
  );
};
