import type { Input, InputContract, JsonAbi } from 'fuels';
import { InputType, getInputsByType } from 'fuels';
import { AbiService } from '~/systems/Settings/services';

export async function getAbiMap({
  inputs,
  contractIds: inputContractIds,
}: {
  inputs?: Input[];
  contractIds?: string[];
}) {
  const contractIds =
    inputContractIds ||
    getInputsByType<InputContract>(inputs || [], InputType.Contract).map(
      (input) => input.contractID
    );

  const abis = await Promise.all(
    contractIds.map((contractId) => AbiService.getAbi({ data: contractId }))
  );
  const abiMap = abis.reduce(
    (prev, abi, index) => {
      if (abi) {
        prev[contractIds[index]] = abi;
      }

      return prev;
    },
    {} as Record<string, JsonAbi>
  );

  return abiMap;
}
