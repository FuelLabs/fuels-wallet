import { render } from '@fuel-ui/test-utils';

import { TestWrapper } from '../../components';

type RenderWithProviderOpts = {
  route?: string;
  wrapper?: React.ComponentType;
};

export const renderWithProvider = (
  ui: JSX.Element,
  { wrapper = TestWrapper }: RenderWithProviderOpts = {}
) => {
  return render(ui, { wrapper });
};
