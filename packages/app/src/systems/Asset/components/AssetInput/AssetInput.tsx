import { Button, Flex, Input, Text } from '@fuel-ui/react';
import type { Coin } from '@fuels-wallet/types';
import { useState } from 'react';
import type { FC } from 'react';

import { AssetInputLoader } from './AssetInputLoader';

import { formatUnits } from '~/systems/Core';

export type AssetInputProps = {
  asset: Coin;
};

type AssetInputComponent = FC<AssetInputProps> & {
  Loader: typeof AssetInputLoader;
};

export const AssetInput: AssetInputComponent = ({ asset }) => {
  const [assetAmount, setAssetAmount] = useState<string>();

  const handleAmountChange = () => {
    // TODO
    setAssetAmount('');
  };

  const handlePress = () => {
    setAssetAmount(formatUnits(asset.amount));
  };

  return (
    <Input css={{ px: '$3', py: '$2' }}>
      <Input.Number
        inputMode="decimal"
        name="amount"
        placeholder="0.0"
        value={assetAmount}
        onChange={handleAmountChange}
      />
      <Input.ElementRight>
        <Flex direction="column">
          <Button css={{ height: 18, width: 36 }} onPress={handlePress}>
            Max
          </Button>
          <Text css={{ fontSize: '$xs' }}>
            Balance: {formatUnits(asset.amount)}
          </Text>
        </Flex>
      </Input.ElementRight>
    </Input>
  );
};

AssetInput.Loader = AssetInputLoader;
