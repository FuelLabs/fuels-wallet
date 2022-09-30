import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { AssetsTitle } from './AssetsTitle';

describe('AssetsTitle', () => {
  it('a11y', async () => {
    await testA11y(<AssetsTitle />);
  });

  it('should show Assets title', () => {
    render(<AssetsTitle />);
    expect(screen.getByText('Assets')).toBeInTheDocument();
  });
});
