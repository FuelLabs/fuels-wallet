import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { useImportAccountForm } from '../../hooks/useImportAccountForm';

import { ImportAccountForm } from './ImportAccountForm';

const Content = () => {
  const form = useImportAccountForm({ accounts: [] });
  return <ImportAccountForm form={form} />;
};

describe('ImportAccountForm', () => {
  it('a11y', async () => {
    await testA11y(<Content />);
  });

  it('should render the component', async () => {
    render(<Content />);
    const label = screen.getByLabelText('Private Key');
    expect(label).toBeDefined();
    const placeholder = screen.getByPlaceholderText(
      'Enter the private key to import from'
    );
    expect(placeholder).toBeDefined();
  });
});
