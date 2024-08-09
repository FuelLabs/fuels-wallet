import { fireEvent, render, screen } from '@fuel-ui/test-utils';
import { act, useState } from 'react';
import { TestWrapper } from '~/systems/Core';

import { MOCK_ASSETS_AMOUNTS } from '../../__mocks__/assets';

import { AssetSelect } from './AssetSelect';

const onSelect = jest.fn();

type ContentProps = {
  initialSelected?: string | null;
};

function Content({ initialSelected = null }: ContentProps) {
  const [selected, setSelected] = useState<string | null>(initialSelected);

  function handleSelect(assetId?: string | null) {
    onSelect(assetId);
    setSelected(assetId!);
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
    const { container } = render(<Content />, { wrapper: TestWrapper });

    const input = screen.getByText('Select one asset');
    expect(input).toBeInTheDocument();
    await act(() => fireEvent.click(input));

    const etherItem = await screen.findByText('Ethereum');
    expect(etherItem).toBeInTheDocument();
    await act(() => fireEvent.click(etherItem));

    const trigger = container.querySelector('.fuel_Dropdown-trigger');
    expect(() => screen.getByText('Select one asset')).toThrow();
    // debug();
    expect(trigger?.getAttribute('data-value')).toBe('Ethereum');
    expect(onSelect).toHaveBeenCalledWith(MOCK_ASSETS_AMOUNTS[0].assetId);
  });

  it('should have an initial selected item', async () => {
    const { container } = render(
      <Content initialSelected={MOCK_ASSETS_AMOUNTS[0].assetId} />,
      { wrapper: TestWrapper }
    );
    // expect(() => screen.getByText('Select one asset')).toThrow();
    const trigger = container.querySelector('.fuel_Dropdown-trigger');
    // console.log(`trigger?.textContent`, trigger?.textContent);
    expect(trigger?.textContent?.includes('Ethereum')).toBe(true);
  });

  it('should clear on click on clear button', async () => {
    const { container } = render(<Content />, { wrapper: TestWrapper });

    const input = screen.getByText('Select one asset');
    await act(() => fireEvent.click(input));
    const etherItem = await screen.findByText('Ethereum');
    await act(() => fireEvent.click(etherItem));
    expect(onSelect).toBeCalledWith(MOCK_ASSETS_AMOUNTS[0].assetId);

    const trigger = container.querySelector('.fuel_Dropdown-trigger');
    expect(trigger?.textContent?.includes('Ethereum')).toBe(true);

    const clearBtn = await screen.findByLabelText('Clear');
    await act(() => fireEvent.click(clearBtn));
    expect(await screen.findByText('Select one asset')).toBeInTheDocument();
    expect(onSelect).toBeCalledWith(null);
  });
});
