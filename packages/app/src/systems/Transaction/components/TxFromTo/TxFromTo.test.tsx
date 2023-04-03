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
    expect(screen.getByText('fuel1g...kuj7')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should show spinner and loaders when isLoading is true and from and to are empty', async () => {
    render(<TxFromTo isLoading />);
    expect(() => screen.getByText('From')).toThrow();
    expect(() => screen.getByText('fuel1g...kuj7')).toThrow();
    expect(() => screen.getByText('To (Contract)')).toThrow();
    expect(() => screen.getByText('fuel1y...y6wk')).toThrow();
    expect(screen.getByLabelText('Loading Spinner')).toBeInTheDocument();
  });

  it('should show info and spinner when isLoading is true and from and to exits', async () => {
    render(<TxFromTo {...PROPS} isLoading />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1g...kuj7')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading Spinner')).toBeInTheDocument();
  });

  it('should show address info and not have spinner when status is pending', async () => {
    render(<TxFromTo {...PROPS} status={TxStatus.pending} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1g...kuj7')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should show address info and not have spinner when status is success', async () => {
    render(<TxFromTo {...PROPS} status={TxStatus.success} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1g...kuj7')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should show address info and not have spinner when status is error', async () => {
    render(<TxFromTo {...PROPS} status={TxStatus.failure} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1g...kuj7')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });
});
