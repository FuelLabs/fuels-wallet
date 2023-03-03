import { useMemo } from 'react';
import * as yup from 'yup';

import { useAccounts } from './useAccounts';

export function useAccountFormNameObj() {
  const { accounts } = useAccounts();

  return useMemo(() => {
    const names = (accounts || []).map((account) => account.name);

    return yup
      .string()
      .trim()
      .notOneOf(names, 'Name is already in use')
      .required('Name is required');
  }, [accounts]);
}
