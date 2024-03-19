import { getInputsContract } from 'fuels';
import type { Input } from 'fuels';
import { useMemo } from 'react';

type ContractIdsProps = {
  inputs?: Input[];
};

export function useContractIds(props: Partial<ContractIdsProps>) {
  const { inputs } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const contractIds = useMemo(() => {
    if (!inputs?.length) return undefined;

    const contractInputs = getInputsContract(inputs);

    return contractInputs;
  }, [JSON.stringify(inputs || [])]);
  return { contractIds };
}
