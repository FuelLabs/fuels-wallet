import type { Operation } from 'fuels';
import { NetworkService } from '~/systems/Network';
import type { OperationWithDomain } from '~/systems/Transaction';
import NameSystemService from '../services/nameSystem';

export const getDomainByOperations = async (
  operations: Operation[]
): Promise<OperationWithDomain[]> => {
  return await Promise.all(
    operations.map(async (operation) => {
      const to = operation.to?.address;
      const currentNetwork = await NetworkService.getSelectedNetwork();
      const toDomain = await NameSystemService.resolverAddress({
        address: to!,
        chainId: currentNetwork?.chainId!,
      });
      const fromDomain = await NameSystemService.resolverAddress({
        address: operation.from?.address!,
        chainId: currentNetwork?.chainId!,
      });

      return {
        ...operation,
        to: operation.to
          ? {
              ...operation.to,
              domain: toDomain,
            }
          : undefined,
        from: operation.from
          ? {
              ...operation.from,
              domain: fromDomain,
            }
          : undefined,
      };
    })
  );
};
