import { getInputsByType, InputType } from 'fuels';
import type { InputContract, Input } from 'fuels';
import { useMemo } from 'react';

type ContractIdsProps = {
  inputs?: Input[];
};

export function useContractIds(props: Partial<ContractIdsProps>) {
  const { inputs } = props;
  const contractIds = useMemo(() => {
    if (!inputs?.length) return undefined;

    // TODO: should change here to use `getInputsContract` when SDK includes it
    const contractInputs = getInputsByType<InputContract>(
      inputs,
      InputType.Contract
    ).map((input) => input.contractID);

    return contractInputs;
  }, [JSON.stringify(inputs || [])]);
  return { contractIds };
}
