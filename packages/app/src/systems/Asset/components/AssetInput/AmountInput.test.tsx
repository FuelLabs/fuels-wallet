import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ASSETS } from '../../__mocks__/assets';

import { AmountInput } from './AmountInput';

describe('AmountInput', () => {
  it('a11y', async () => {
    await testA11y(<AmountInput asset={MOCK_ASSETS[0]} />);
  });
  it('should show placeholder', () => {
    render(<AmountInput asset={MOCK_ASSETS[0]} />);
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });
  it('should show balance formatted', () => {
    render(<AmountInput asset={MOCK_ASSETS[0]} />);
    expect(screen.getByText('Balance: 14.56')).toBeInTheDocument();
  });
  it('should display balance in input when click on max button', async () => {
    const { user } = render(<AmountInput asset={MOCK_ASSETS[0]} />);
    const maxBtn = screen.getByLabelText('Max');
    expect(maxBtn).toBeInTheDocument();

    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    await user.click(maxBtn);
    expect(screen.getByDisplayValue('14.56')).toBeInTheDocument();
  });
});
