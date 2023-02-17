import { VaultClient } from './VaultClient';
import type { VaultMethods } from './VaultServer';

export const VaultService = new VaultClient() as unknown as VaultMethods;
