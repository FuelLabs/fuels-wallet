import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';

import { TxRecipientCard } from './TxRecipientCard';

const { account: ACCOUNT, contract: CONTRACT } = MOCK_TX_RECIPIENT;

describe('TxRecipientCard', () => {
  it('a11y', async () => {
    await testA11y(<TxRecipientCard recipient={ACCOUNT} />);
  });

  it('should render account correctly', () => {
    render(<TxRecipientCard recipient={ACCOUNT} />);
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
  });

  it('should render contract correctly', () => {
    render(<TxRecipientCard recipient={CONTRACT} />);
    expect(screen.getByText('From (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
  });

  it('should change title with isReceiver prop', () => {
    render(<TxRecipientCard recipient={CONTRACT} isReceiver />);
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
  });
});
