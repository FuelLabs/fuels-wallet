import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { EmptyList } from './EmptyList';

describe('EmptyList', () => {
  it('a11y', async () => {
    await testA11y(<EmptyList label="No items found" />);
  });

  it('should render an label', async () => {
    render(<EmptyList label="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });
});
