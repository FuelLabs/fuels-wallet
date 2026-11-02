import { Mnemonic, Wallet } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { VaultServer } from './VaultServer';

describe('VaultServer.clear', () => {
  beforeEach(async () => {
    await db.open();
  });

  afterEach(async () => {
    await db.clear();
  });

  it.each([2, 3])('removes all %i vaults', async (count) => {
    const server = new VaultServer();
    await server.unlock({ password: 'old-password' });
    await server.createVault({ type: 'mnemonic', secret: Mnemonic.generate() });
    for (let i = 1; i < count; i++) {
      await server.createVault({
        type: 'privateKey',
        secret: Wallet.generate().privateKey,
      });
    }

    await server.clear();

    expect(await server.isLocked()).toBe(true);
    await server.unlock({ password: 'old-password' });
    expect(await server.getVaults()).toEqual([]);
  });

  it('clears a locked wallet, as the forgot password reset does', async () => {
    const server = new VaultServer();
    await server.unlock({ password: 'old-password' });
    await server.createVault({ type: 'mnemonic', secret: Mnemonic.generate() });
    await server.lock();

    await expect(server.clear()).resolves.toBeUndefined();
    expect(await server.isLocked()).toBe(true);
  });

  it('does not carry an old private key into the next wallet', async () => {
    const oldKey = Wallet.generate().privateKey;
    const oldAddress = Wallet.fromPrivateKey(oldKey).address.toString();
    const server = new VaultServer();
    await server.unlock({ password: 'old-password' });
    await server.createVault({ type: 'mnemonic', secret: Mnemonic.generate() });
    await server.createVault({ type: 'privateKey', secret: oldKey });

    // Logout clears the vault first, then the database
    await server.clear();
    await db.clear();
    await server.unlock({ password: 'new-password' });
    await server.createVault({ type: 'mnemonic', secret: Mnemonic.generate() });

    const reopened = new VaultServer();
    await reopened.unlock({ password: 'new-password' });
    expect((await reopened.getVaults()).map((v) => v.type)).toEqual([
      'mnemonic',
    ]);
    await expect(
      reopened.exportPrivateKey({
        address: oldAddress,
        password: 'new-password',
      })
    ).rejects.toThrow();
  });
});
