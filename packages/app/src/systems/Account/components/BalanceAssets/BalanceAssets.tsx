import { Button, CardList } from '@fuel-ui/react';
import type { CoinAsset } from '@fuel-wallet/types';
import { useMemo, useState } from 'react';
import { AssetItem, AssetList } from '~/systems/Asset/components';
import type { AssetListEmptyProps } from '~/systems/Asset/components/AssetList/AssetListEmpty';

export type BalanceAssetListProp = {
  balances?: CoinAsset[];
  isLoading?: boolean;
  onRemove?: (assetId: string) => void;
  onEdit?: (assetId: string) => void;
  emptyProps?: AssetListEmptyProps;
};

export const BalanceAssets = ({
  balances,
  isLoading,
  emptyProps = {},
  onRemove,
  onEdit,
}: BalanceAssetListProp) => {
  const [showUnknown, setShowUnknown] = useState(false);
  const unknownLength = useMemo(
    () => balances?.filter((balance) => !balance.asset?.name).length,
    [balances]
  );

  if (isLoading) return <AssetList.Loading items={4} />;
  const isEmpty = !balances || !balances.length;
  if (isEmpty) return <AssetList.Empty {...emptyProps} />;
  const balancesToShow = balances.filter(
    (balance) => showUnknown || balance.asset?.name
  );

  function toggle() {
    setShowUnknown((s) => !s);
  }

  return (
    <CardList>
      {balancesToShow.map((balance) => (
        <AssetItem
          key={balance.asset?.name}
          fuelAsset={balance.asset}
          amount={balance.amount}
          onRemove={onRemove}
          onEdit={onEdit}
          showActions={false}
        />
      ))}
      {!!(!isLoading && unknownLength) && (
        <Button size="xs" variant="link" onPress={toggle}>
          {showUnknown ? 'Hide' : 'Show'} unknown assets ({unknownLength})
        </Button>
      )}
    </CardList>
  );
};
