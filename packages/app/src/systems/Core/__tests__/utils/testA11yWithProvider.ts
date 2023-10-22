import { testA11y } from '@fuel-ui/test-utils';

import { TestWrapper } from '../../components';

type RenderWithProviderOpts = {
  route?: string;
  wrapper?: React.ComponentType;
};

export const testA11yWithProvider = (
  ui: JSX.Element,
  { wrapper = TestWrapper }: RenderWithProviderOpts = {}
) => {
  return testA11y(ui, { wrapper });
};
