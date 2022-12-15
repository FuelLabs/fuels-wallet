import { Send } from './Send';

import { createMockAccount } from '~/systems/Account';
import { NetworkService } from '~/systems/Network';

export default {
  component: Send,
  title: 'Send/Pages/Send',
  viewport: {
    defaultViewport: 'chromeExtension',
  },
  loaders: [
    async () => {
      await createMockAccount();
      await NetworkService.clearNetworks();
      await NetworkService.addFirstNetwork();
      return {};
    },
  ],
};

export const Usage = () => <Send />;
Usage.parameters = {
  layout: 'fullscreen',
};
