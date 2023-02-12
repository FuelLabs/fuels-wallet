import type { VaultWebConnector } from '../connectors';

export function mockUnlock(connector: VaultWebConnector) {
  const password = localStorage.getItem('password');
  if (password) {
    connector.vault.unlock({ password });
  }
  // Mock unlock
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  connector.clientVault.unlock = async ({ password }) => {
    await connector.vault.unlock({ password });
    localStorage.setItem('password', password);
  };
}
