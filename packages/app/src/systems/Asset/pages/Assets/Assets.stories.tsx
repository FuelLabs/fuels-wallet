// import { connectionsLoader } from '../../__mocks__/connection';

import { Assets } from './Assets';

export default {
  component: Assets,
  title: 'Settings/Pages/Assets',
  // loaders: [connectionsLoader],
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
};

export const List = () => <Assets />;
List.parameters = {
  layout: 'fullscreen',
};

export const Edit = () => <Assets />;
Edit.parameters = {
  layout: 'fullscreen',
  reactRouter: {
    searchParams: { origin: 'uniswap.org' },
  },
};
