import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';
import { TxState } from '../../types';

import { TxFromTo } from './TxFromTo';

const PROPS = {
  from: MOCK_TX_RECIPIENT.account,
  to: MOCK_TX_RECIPIENT.contract,
};

describe('TxFromTo', () => {
  it('a11y', async () => {
    await testA11y(<TxFromTo {...PROPS} />);
  });

  it('should render both cards correctly', async () => {
    render(<TxFromTo {...PROPS} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
  });

  it('should show a spinner when state is pending', async () => {
    render(<TxFromTo {...PROPS} state={TxState.pending} />);
    expect(() => screen.getByText('From')).toThrow();
    expect(() => screen.getByText('fuel1y...y6wk')).toThrow();
    expect(() => screen.getByText('To (Contract)')).toThrow();
    expect(() => screen.getByText('0x277f...207c')).toThrow();
  });
});
