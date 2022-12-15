import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { Usage } from './TxErrors.stories';

describe('TxErrors', () => {
  it('a11y', async () => {
    await testA11y(<Usage />);
  });

  it('should show an invalid transaction error', async () => {
    render(<Usage />);
    expect(screen.getByText('Invalid Transaction')).toBeInTheDocument();
  });

  it('should copy errors', async () => {
    const { user } = render(<Usage />);
    const btn = screen.getByText('Copy Error Message');
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toContain(
      'errorMessage": "ExampleError: an example of error'
    );
  });
});
