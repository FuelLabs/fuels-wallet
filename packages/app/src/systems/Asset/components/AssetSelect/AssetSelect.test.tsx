import { render, screen, waitFor } from '@fuel-ui/test-utils';
import { useState } from 'react';

import { MOCK_ASSETS_AMOUNTS } from '../../__mocks__/assets';

import type { AssetSelectInput } from './AssetSelect';
import { AssetSelect } from './AssetSelect';

const onSelect = jest.fn();

type ContentProps = {
  initialSelected?: AssetSelectInput | null;
};

function Content({ initialSelected = null }: ContentProps) {
  const [selected, setSelected] = useState<AssetSelectInput>(
    initialSelected as AssetSelectInput
  );

  function handleSelect(asset?: AssetSelectInput | null) {
    onSelect(asset);
    setSelected(asset!);
  }

  return (
    <AssetSelect
      items={MOCK_ASSETS_AMOUNTS}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}

describe('AssetSelect', () => {
  it('should select an asset when click', async () => {
    const { user, container } = render(<Content />);

    const input = screen.getByText('Select one asset');
    expect(input).toBeInTheDocument();
    await user.click(input);

    const etherItem = await screen.findByText('Ethereum');
    expect(etherItem).toBeInTheDocument();

    await user.press('Enter');
    const trigger = container.querySelector('#fuel_asset-select');
    expect(() => screen.getByText('Select one asset')).toThrow();
    expect(trigger?.textContent?.includes('Ethereum')).toBe(true);
    expect(onSelect).toBeCalledWith(MOCK_ASSETS_AMOUNTS[0]);
  });

  it('should can have an initial selected item', async () => {
    const { container } = render(
      <Content initialSelected={MOCK_ASSETS_AMOUNTS[0]} />
    );
    expect(() => screen.getByText('Select one asset')).toThrow();
    const trigger = container.querySelector('#fuel_asset-select');
    expect(trigger?.textContent?.includes('Ethereum')).toBe(true);
  });

  it('should clear on click on clear button', async () => {
    const { user, container } = render(<Content />);

    const input = screen.getByText('Select one asset');
    await user.click(input);
    await user.press('Enter');
    expect(onSelect).toBeCalledWith(MOCK_ASSETS_AMOUNTS[0]);

    const trigger = container.querySelector('#fuel_asset-select');
    expect(trigger?.textContent?.includes('Ethereum')).toBe(true);

    await waitFor(async () => {
      const clearBtn = await screen.findByLabelText('Clear');
      await user.click(clearBtn);
      expect(await screen.findByText('Select one asset')).toBeInTheDocument();
      expect(onSelect).toBeCalledWith(null);
    });
  });
});
