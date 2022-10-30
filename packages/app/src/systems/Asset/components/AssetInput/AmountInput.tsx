import { Button, Flex, Input, Text } from '@fuel-ui/react';
import type { Coin } from '@fuels-wallet/types';
import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';

import { AmountInputLoader } from './AmountInputLoader';

import { formatUnits } from '~/systems/Core';

export type AmountInputProps = {
  asset: Coin;
};

type AmountInputComponent = FC<AmountInputProps> & {
  Loader: typeof AmountInputLoader;
};

export const AmountInput: AmountInputComponent = ({ asset }) => {
  const [assetAmount, setAssetAmount] = useState<string>();

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAssetAmount(event.target.value);
  };

  const handlePress = () => {
    setAssetAmount(formatUnits(asset.amount));
  };

  return (
    <Input
      size="lg"
      css={{ height: 'auto', display: 'flex', alignItems: 'center' }}
    >
      <Input.Number
        inputMode="decimal"
        name="amount"
        placeholder="0.0"
        value={assetAmount}
        onChange={handleAmountChange}
      />
      <Input.ElementRight>
        <Flex direction="column" align="end" basis="auto">
          <Button
            size="xs"
            variant="ghost"
            css={{ width: '75%' }}
            onPress={handlePress}
          >
            Max
          </Button>
          <Text css={{ fontSize: '$xs', whiteSpace: 'nowrap' }}>
            Balance: {formatUnits(asset.amount)}
          </Text>
        </Flex>
      </Input.ElementRight>
    </Input>
  );
};

AmountInput.Loader = AmountInputLoader;
