import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { AssetList } from 'asset-list';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';

import { TxOperation } from './TxOperation';

import { TestWrapper } from '~/systems/Core';

const PROPS = {
  operation: MOCK_OPERATION_CONTRACT_CALL,
  assets: AssetList,
};

describe('TxOperation', () => {
  it('a11y', async () => {
    await testA11y(<TxOperation {...PROPS} />, { wrapper: TestWrapper });
  });

  it('should render operation to contract and dont have spinner', async () => {
    render(<TxOperation {...PROPS} />, { wrapper: TestWrapper });
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('should render operation to account', async () => {
    render(
      <TxOperation operation={MOCK_OPERATION_TRANSFER} assets={AssetList} />,
      {
        wrapper: TestWrapper,
      }
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('fuel1a...7n30')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('should render no assets Sent', async () => {
    render(
      <TxOperation
        operation={{ ...MOCK_OPERATION_TRANSFER, assetsSent: undefined }}
        assets={AssetList}
      />,
      { wrapper: TestWrapper }
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('fuel1a...7n30')).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
    expect(() => screen.getByText('Ethereum')).toThrow();
  });
});
