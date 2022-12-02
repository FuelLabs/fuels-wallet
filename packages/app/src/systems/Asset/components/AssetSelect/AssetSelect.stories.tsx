/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@fuel-ui/react';
import { useState } from 'react';

import { MOCK_ASSETS_AMOUNTS } from '../../__mocks__/assets';

import type { AssetSelectInput, AssetSelectProps } from './AssetSelect';
import { AssetSelect } from './AssetSelect';

export default {
  component: AssetSelect,
  title: 'Asset/Components/AssetSelect',
};

export const Usage = (_args: AssetSelectProps) => {
  const [selected, setSelected] = useState<AssetSelectInput>(null as any);
  return (
    <Box css={{ maxWidth: 300 }}>
      <AssetSelect
        selected={selected}
        onSelect={(asset) => setSelected(asset!)}
        items={MOCK_ASSETS_AMOUNTS}
      />
    </Box>
  );
};
