import { connectionsLoader } from '../../__mocks__/connection';

import { Connections } from './Connections';

export default {
  component: Connections,
  title: 'Settings/Pages/3. Connections',
  loaders: [connectionsLoader],
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
};

export const List = () => <Connections />;
List.parameters = {
  layout: 'fullscreen',
};

export const Edit = () => <Connections />;
Edit.parameters = {
  layout: 'fullscreen',
  reactRouter: {
    searchParams: { origin: 'uniswap.org' },
  },
};
