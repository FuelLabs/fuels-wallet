import { screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';

import { TxRecipientCard } from './TxRecipientCard';

import { TestWrapper } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__';

const { account: ACCOUNT, contract: CONTRACT } = MOCK_TX_RECIPIENT;

describe('TxRecipientCard', () => {
  it('a11y', async () => {
    await testA11y(<TxRecipientCard recipient={ACCOUNT} />, {
      wrapper: TestWrapper,
    });
  });

  it('a11yLoader ', async () => {
    await testA11y(<TxRecipientCard.Loader />);
  });

  it('should render account correctly', () => {
    renderWithProvider(<TxRecipientCard recipient={ACCOUNT} />);
    expect(screen.getByText('fuel1g...kuj7')).toBeInTheDocument();
  });

  it('should render contract correctly', () => {
    renderWithProvider(<TxRecipientCard recipient={CONTRACT} />);
    expect(screen.getByText('From (Contract)')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
  });

  it('should change title with isReceiver prop', () => {
    renderWithProvider(<TxRecipientCard recipient={CONTRACT} isReceiver />);
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
  });
});
