import type { VaultWebConnector } from '../connectors';
import type { VaultInputs } from '../services';

export function mockUnlock(connector: VaultWebConnector) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const clientVault = connector.clientVault as any;
  const password = localStorage.getItem('password');
  if (password) {
    connector.vault.unlock({ password });
  }

  // Mock unlock in development to save password
  // on session Storage and unlock vault on reload
  clientVault.unlock = async ({ password }: VaultInputs['unlock']) => {
    await connector.vault.unlock({ password });
    localStorage.setItem('password', password);
  };

  clientVault.lock = async () => {
    await connector.vault.lock();
    localStorage.removeItem('password');
  };
}
