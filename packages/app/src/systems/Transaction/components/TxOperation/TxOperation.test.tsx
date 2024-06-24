import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { TestWrapper, shortAddress } from '~/systems/Core';

import {
  MOCK_FUEL_ASSETS,
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';

import { Address } from 'fuels';
import { TxOperation } from './TxOperation';

const PROPS = {
  operation: MOCK_OPERATION_CONTRACT_CALL,
  assets: MOCK_FUEL_ASSETS,
};

describe('TxOperation', () => {
  it('a11y', async () => {
    await testA11y(<TxOperation {...PROPS} />, { wrapper: TestWrapper });
  });

  it('should render operation to contract and dont have spinner', async () => {
    render(<TxOperation {...PROPS} />, { wrapper: TestWrapper });
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(
          Address.fromDynamicInput(PROPS.operation.from?.address!).toB256()
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(
          Address.fromDynamicInput(PROPS.operation.to?.address!).toB256()
        )
      )
    ).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('should render operation to account', async () => {
    render(
      <TxOperation operation={MOCK_OPERATION_TRANSFER} assets={PROPS.assets} />,
      {
        wrapper: TestWrapper,
      }
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(
          Address.fromDynamicInput(
            MOCK_OPERATION_TRANSFER.from?.address!
          ).toB256()
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(
          Address.fromDynamicInput(
            MOCK_OPERATION_TRANSFER.to?.address!
          ).toB256()
        )
      )
    ).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('should render no assets Sent', async () => {
    render(
      <TxOperation
        operation={{ ...MOCK_OPERATION_TRANSFER, assetsSent: undefined }}
        assets={PROPS.assets}
      />,
      { wrapper: TestWrapper }
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(
          Address.fromDynamicInput(
            MOCK_OPERATION_TRANSFER.from?.address!
          ).toB256()
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(
          Address.fromDynamicInput(
            MOCK_OPERATION_TRANSFER.to?.address!
          ).toB256()
        )
      )
    ).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
    expect(() => screen.getByText('Ethereum')).toThrow();
  });
});
