import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';
import { TxStatus } from '../../utils';

import { TxFromTo } from './TxFromTo';

const PROPS = {
  from: MOCK_TX_RECIPIENT.account,
  to: MOCK_TX_RECIPIENT.contract,
};

describe('TxFromTo', () => {
  it('a11y', async () => {
    await testA11y(<TxFromTo {...PROPS} />);
  });

  it('should render both cards correctly and dont have spinner', async () => {
    render(<TxFromTo {...PROPS} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should not show any address info and show spinner when isLoading is true', async () => {
    render(<TxFromTo {...PROPS} isLoading />);
    expect(() => screen.getByText('From')).toThrow();
    expect(() => screen.getByText('fuel1y...y6wk')).toThrow();
    expect(() => screen.getByText('To (Contract)')).toThrow();
    expect(() => screen.getByText('0x277f...207c')).toThrow();
    expect(screen.getByLabelText('Loading Spinner')).toBeInTheDocument();
  });

  it('should show address info and show spinner when status is pending', async () => {
    render(<TxFromTo {...PROPS} status={TxStatus.pending} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading Spinner')).toBeInTheDocument();
  });

  it('should show address info and not have spinner when status is success', async () => {
    render(<TxFromTo {...PROPS} status={TxStatus.success} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should show address info and not have spinner when status is error', async () => {
    render(<TxFromTo {...PROPS} status={TxStatus.failure} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });
});
