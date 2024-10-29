import { useAccount, useWallet } from '@fuels/react';
import { bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';
import { useAction } from '../hooks/useAction';

export const AssetConfigurationCard = () => {
  const [assetData, setAssetData] = useState({
    amount: '',
    subId: '',
    decimals: '',
  });
  const { account } = useAccount();
  const wallet = useWallet({ account });
  const { disabled, execute, error } = useAction({
    isValid:
      !!wallet &&
      !!assetData.amount &&
      !!assetData.subId &&
      !!assetData.decimals,
    action: async () => {
      if (
        wallet.wallet &&
        assetData.amount &&
        assetData.subId &&
        assetData.decimals
      ) {
        await mint({
          wallet: wallet.wallet!,
          amount: bn.parseUnits(assetData.amount, Number(assetData.decimals)),
          subId: assetData.subId,
        });
      }
    },
  });

  return (
    <div>
      <p>Asset Configuration</p>
      <div>
        <label>Amount</label>
        <br />
        <input
          aria-label="Asset config amount"
          value={assetData.amount}
          onChange={(event) =>
            setAssetData({ ...assetData, amount: event.target.value })
          }
        />
        <br />
        <label>Asset SubId</label>
        <br />
        <input
          aria-label="Asset config subid"
          value={assetData.subId}
          onChange={(event) =>
            setAssetData({ ...assetData, subId: event.target.value })
          }
        />
        <br />
        <label>Asset Decimals</label>
        <br />
        <input
          aria-label="Asset config decimals"
          value={assetData.decimals}
          onChange={(event) =>
            setAssetData({ ...assetData, decimals: event.target.value })
          }
        />
        <br />
        <button type="button" disabled={disabled} onClick={execute}>
          Mint Asset configuration
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr />
      </div>
    </div>
  );
};
