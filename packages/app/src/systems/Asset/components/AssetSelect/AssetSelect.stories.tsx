import { Box } from '@fuel-ui/react';
import { useState } from 'react';

import { MOCK_ASSETS_AMOUNTS } from '../../__mocks__/assets';

import type { AssetSelectProps } from './AssetSelect';
import { AssetSelect } from './AssetSelect';

export default {
  component: AssetSelect,
  title: 'Asset/Components/AssetSelect',
};

export const Usage = (_args: AssetSelectProps) => {
  const [selected, setSelected] = useState<string>();
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

export const Selected = (_args: AssetSelectProps) => {
  const [selected, setSelected] = useState<string>(
    MOCK_ASSETS_AMOUNTS[0].assetId
  );
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
