import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { TxState } from '../../types';

import { TxFromTo } from './TxFromTo';

const ACCOUNT = {
  address: 'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
};

const CONTRACT = {
  address: '0x277fe98efbafc2ee0a533e41104bf0b163ad35c180c2da4e1403ea5445f6207c',
};

const PROPS = {
  from: ACCOUNT.address,
  to: CONTRACT.address,
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
