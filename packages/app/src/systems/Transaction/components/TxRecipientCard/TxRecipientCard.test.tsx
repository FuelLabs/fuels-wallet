import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { TxRecipientCard } from './TxRecipientCard';

const ACCOUNT = {
  name: 'Account 1',
  address: 'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
  publicKey: '0x00',
};

const CONTRACT = {
  address: '0x277fe98efbafc2ee0a533e41104bf0b163ad35c180c2da4e1403ea5445f6207c',
};

describe('TxRecipientCard', () => {
  it('a11y', async () => {
    await testA11y(<TxRecipientCard address={ACCOUNT.address} />);
  });

  it('should render account correctly', () => {
    render(<TxRecipientCard address={ACCOUNT.address} />);
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
  });

  it('should render contract correctly', () => {
    render(<TxRecipientCard address={CONTRACT.address} />);
    expect(screen.getByText('From (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
  });

  it('should change title with isReceiver prop', () => {
    render(<TxRecipientCard address={CONTRACT.address} isReceiver />);
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
  });
});
