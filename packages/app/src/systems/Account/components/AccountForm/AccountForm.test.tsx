import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';
import { useAccountForm } from '../../hooks/useAccountForm';

import { AccountForm } from './AccountForm';

const Content = () => {
  const form = useAccountForm();
  return <AccountForm form={form} />;
};

const ContentWithValues = () => {
  const form = useAccountForm({
    defaultValues: MOCK_ACCOUNTS[0],
  });
  return <AccountForm form={form} />;
};

describe('AccountForm', () => {
  it('a11y', async () => {
    await testA11y(<Content />);
  });

  it('should render the component', async () => {
    render(<Content />);
    const label = screen.getByLabelText('Account Name');
    expect(label).toBeDefined();
    const placeholder = screen.getByPlaceholderText('Type account name');
    expect(placeholder).toBeDefined();
  });

  it('should render the component with values', async () => {
    render(<ContentWithValues />);
    const label = screen.getByLabelText('Account Name');
    expect(label).toBeDefined();
    const placeholder = screen.getByDisplayValue('Account 1');
    expect(placeholder).toBeDefined();
  });
});
