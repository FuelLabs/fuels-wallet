import type { Input } from 'fuels';
import { useMemo } from 'react';

import { getInputsContract } from '../utils';

type ContractIdsProps = {
  inputs?: Input[];
};

export function useContractIds(props: Partial<ContractIdsProps>) {
  const { inputs } = props;
  const contractIds = useMemo(() => {
    if (!inputs?.length) return undefined;

    return getInputsContract(inputs).map((input) => input.contractID);
  }, [JSON.stringify(inputs || [])]);
  return { contractIds };
}
