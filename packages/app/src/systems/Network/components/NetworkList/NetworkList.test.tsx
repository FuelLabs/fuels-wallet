import { render, screen } from '@fuel-ui/test-utils';
import { uniqueId } from 'xstate/lib/utils';

import { MOCK_NETWORKS } from '../../__mocks__/networks';

import { NetworkList } from './NetworkList';

import { TestWrapper } from '~/systems/Core/components/TestWrapper';

const NETWORKS = MOCK_NETWORKS.map((i) => ({ ...i, id: uniqueId() }));

describe('NetworkList', () => {
  it('should render a list of networks', () => {
    render(<NetworkList networks={NETWORKS} />, { wrapper: TestWrapper });
    expect(screen.getByText(NETWORKS[0].name)).toBeInTheDocument();
    expect(screen.getByText(NETWORKS[1].name)).toBeInTheDocument();
  });
});
