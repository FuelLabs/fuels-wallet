// Deep imports keep the fuels SDK out of the content script, which runs on every page
import { ContentProxyConnection } from '@fuel-wallet/connections/src/ContentProxyConnection';

const connection = ContentProxyConnection.start(import.meta.env.VITE_CRX_NAME);

// Ensure cleanup when the content script is unloaded
window.addEventListener('beforeunload', () => {
  connection.destroy(false);
});
