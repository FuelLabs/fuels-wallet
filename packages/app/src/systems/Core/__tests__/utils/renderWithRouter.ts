import { render } from '@fuel-ui/test-utils';

type RenderWithRouterOpts = {
  route?: string;
  wrapper?: React.ComponentType;
};

export const renderWithRouter = (
  ui: JSX.Element,
  { route = '/', wrapper }: RenderWithRouterOpts
) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper });
};
