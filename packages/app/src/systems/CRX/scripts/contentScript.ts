import { ContentProxyConnection } from '@fuel-wallet/connections';
import { WALLET_NAME } from '~/config';

const connection = ContentProxyConnection.start(WALLET_NAME);

// Ensure cleanup when the content script is unloaded
window.addEventListener('beforeunload', () => {
  connection.destroy(false);
});
