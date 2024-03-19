import type { Account } from '@fuel-wallet/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { Maybe } from '~/systems/Core';

import { useAccountFormName } from './useAccountFormName';

export type AccountFormValues = {
  name: string;
};

const DEFAULT_VALUES = {
  name: '',
};

export type UseAccountFormReturn = ReturnType<typeof useAccountForm>;

export type UseAddAccountOpts = {
  accounts?: Maybe<Account[]>;
  defaultValues?: Maybe<AccountFormValues>;
};

export function useAccountForm(opts: UseAddAccountOpts = {}) {
  const nameSchemaObj = useAccountFormName(opts?.accounts || []);
  const schema = yup.object({
    name: nameSchemaObj,
  });

  const form = useForm<AccountFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: opts.defaultValues || DEFAULT_VALUES,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    opts.defaultValues && form.reset(opts.defaultValues);
  }, [opts.defaultValues?.name]);

  return form;
}
