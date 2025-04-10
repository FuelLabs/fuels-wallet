import type { Operation } from 'fuels';
import { NetworkService } from '~/systems/Network';
import type { OperationWithDomain } from '~/systems/Transaction';
import NameSystemService from '../services/nameSystem';

export const getDomainByOperations = async (
  operations: Operation[]
): Promise<OperationWithDomain[]> => {
  const currentNetwork = await NetworkService.getSelectedNetwork();
  const chainId = currentNetwork?.chainId;

  if (!chainId && chainId !== 0) {
    return operations;
  }

  const addresses = operations.reduce<Set<string>>((set, operation) => {
    if (operation.to?.address) set.add(operation.to.address);
    if (operation.from?.address) set.add(operation.from.address);
    return set;
  }, new Set());

  const uniqueAddresses = Array.from(addresses);

  const { domains } = await NameSystemService.resolverAddresses({
    addresses: uniqueAddresses,
    chainId,
  });

  if (!domains) {
    return operations;
  }

  const addressToDomainMap = domains.reduce(
    (map, entry) => {
      map[entry.resolver] = `@${entry.name}`;
      return map;
    },
    {} as Record<string, string>
  );

  return operations.map((operation) => ({
    ...operation,
    to: operation.to
      ? {
          ...operation.to,
          domain: addressToDomainMap[operation.to.address] || null,
        }
      : undefined,
    from: operation.from
      ? {
          ...operation.from,
          domain: addressToDomainMap[operation.from.address] || null,
        }
      : undefined,
  }));
};
