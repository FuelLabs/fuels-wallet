import NameSystemService from '~/systems/NameSystem/services/nameSystem';
import { NetworkService } from '~/systems/Network/services/network';
import type { TransactionResultWithDomain } from '../types';

const domainCache = new Map<string, string | null>();

const cacheKey = (chainId: number, address: string) => `${chainId}:${address}`;

export const clearDomainCache = () => domainCache.clear();

export const enrichDomains = async (
  transactionHistory: TransactionResultWithDomain[]
): Promise<TransactionResultWithDomain[]> => {
  if (!transactionHistory || transactionHistory.length === 0) {
    return [];
  }

  try {
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const chainId = currentNetwork?.chainId;

    if (!chainId && chainId !== 0) {
      return transactionHistory;
    }

    const missing = new Set<string>();
    for (const tx of transactionHistory) {
      for (const operation of tx.operations) {
        const address = operation.to?.address;
        if (address && !domainCache.has(cacheKey(chainId, address))) {
          missing.add(address);
        }
      }
    }

    if (missing.size > 0) {
      const addresses = Array.from(missing);
      const { domains } = await NameSystemService.resolverAddresses({
        addresses,
        chainId,
      });

      // Only cache results from a successful lookup, so a failed request is retried
      if (domains) {
        const resolved: Record<string, string> = {};
        for (const entry of domains) {
          resolved[entry.resolver] = `@${entry.name}`;
        }
        for (const address of addresses) {
          domainCache.set(
            cacheKey(chainId, address),
            resolved[address] ?? null
          );
        }
      }
    }

    return transactionHistory.map((tx) => ({
      ...tx,
      operations: tx.operations.map((operation) => ({
        ...operation,
        to: operation.to
          ? {
              ...operation.to,
              domain:
                domainCache.get(cacheKey(chainId, operation.to.address)) ??
                null,
            }
          : undefined,
      })),
    }));
  } catch {
    return transactionHistory;
  }
};
