import { screen, testA11y } from '@fuel-ui/test-utils';
import { Address, TransactionStatus } from 'fuels';
import { TestWrapper, shortAddress } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';

import { TxFromTo } from './TxFromTo';

const PROPS = {
  from: MOCK_TX_RECIPIENT.account,
  to: MOCK_TX_RECIPIENT.contract,
};

describe('TxFromTo', () => {
  it('a11y', async () => {
    await testA11y(<TxFromTo {...PROPS} />, {
      wrapper: TestWrapper,
    });
  });

  it('should render both cards correctly and dont have spinner', async () => {
    renderWithProvider(<TxFromTo {...PROPS} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.from?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.to?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should show spinner and loaders when isLoading is true and from and to are empty', async () => {
    renderWithProvider(<TxFromTo isLoading />);
    expect(() => screen.getByText('From')).toThrow();
    expect(() =>
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.from?.address!).toB256())
      )
    ).toThrow();
    expect(() => screen.getByText('To (Contract)')).toThrow();
    expect(() =>
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.to?.address!).toB256())
      )
    ).toThrow();
    expect(screen.getByLabelText('Loading Spinner')).toBeInTheDocument();
  });

  it('should show info and spinner when isLoading is true and from and to exits', async () => {
    renderWithProvider(<TxFromTo {...PROPS} isLoading />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.from?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.to?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Loading Spinner')).toBeInTheDocument();
  });

  it('should show address info and not have spinner when status is pending', async () => {
    renderWithProvider(
      <TxFromTo {...PROPS} status={TransactionStatus.submitted} />
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.from?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.to?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should show address info and not have spinner when status is success', async () => {
    renderWithProvider(
      <TxFromTo {...PROPS} status={TransactionStatus.success} />
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.from?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.to?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });

  it('should show address info and not have spinner when status is error', async () => {
    renderWithProvider(
      <TxFromTo {...PROPS} status={TransactionStatus.failure} />
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.from?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(screen.getByText('To (Contract)')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(PROPS.to?.address!).toB256())
      )
    ).toBeInTheDocument();
    expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  });
});
