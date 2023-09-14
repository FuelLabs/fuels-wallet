import { screen } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';
import { renderWithRouter } from '~/systems/Core/__tests__/utils';

import { connectionsLoader } from '../../__mocks__/connection';
import { testQueries } from '../../__test__';
import { useConnections } from '../../hooks';

import { Usage } from './ConnectionEdit.stories';

function Content() {
  const state = useConnections();
  return <Usage {...state} />;
}

const opts = {
  route: '/settings/connections?origin=fuellabs.github.io/swayswap',
  wrapper: TestWrapper,
};

describe('ConnectionEdit', () => {
  beforeEach(async () => {
    await connectionsLoader();
  });

  it('should render accounts connected', async () => {
    renderWithRouter(<Content />, opts);
    await testQueries.waitShowingAccounts();
  });

  it('should disconnect account', async () => {
    renderWithRouter(<Content />, opts);
    await testQueries.waitShowingAccounts();
    expect(await screen.findByText('2 connected')).toBeInTheDocument();
    await testQueries.clickToDisconnectAccount();
  });

  it('should see an empty list when not found', async () => {
    renderWithRouter(<Content />, opts);
    await testQueries.waitShowingAccounts();
    await testQueries.testSearch('No account found');
  });
});
