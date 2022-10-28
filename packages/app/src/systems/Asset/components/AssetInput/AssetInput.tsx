import { Button, Input, Stack } from '@fuel-ui/react';
import type { Coin } from '@fuels-wallet/types';
import type { FC } from 'react';

import { AssetInputLoader } from './AssetInputLoader';

export type AssetInputProps = {
  asset: Coin;
};

type AssetInputComponent = FC<AssetInputProps> & {
  Loader: typeof AssetInputLoader;
};

export const AssetInput: AssetInputComponent = ({ asset }) => {
  return (
    <Stack>
      <Input>
        <Input.Number
          inputMode="decimal"
          name="amount"
          placeholder="0.0"
          value={asset.amount.toString()}
        />
        <Input.ElementRight>
          <Button>Max</Button>
        </Input.ElementRight>
      </Input>
    </Stack>
  );
};

AssetInput.Loader = AssetInputLoader;
