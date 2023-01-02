/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { Account } from '@fuel-wallet/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import type { Maybe } from '~/systems/Core';

export type AccountFormValues = {
  name: string;
};

const DEFAULT_VALUES = {
  name: '',
};

export type UseAccountFormReturn = ReturnType<typeof useAccountForm>;

export type UseAddAccountOpts = {
  accounts?: Array<Account>;
  defaultValues?: Maybe<AccountFormValues>;
};

function useAccountFormSchema(opts?: Pick<UseAddAccountOpts, 'accounts'>) {
  return useMemo(() => {
    const names = (opts?.accounts || []).map((account) => account.name);
    return yup.object({
      name: yup
        .string()
        .trim()
        .notOneOf(names, 'Name is already in use')
        .required('Name is required'),
    });
  }, [opts?.accounts]);
}

export function useAccountForm(opts: UseAddAccountOpts = {}) {
  const schema = useAccountFormSchema(opts);
  const form = useForm<AccountFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: opts.defaultValues || DEFAULT_VALUES,
  });

  useEffect(() => {
    opts.defaultValues && form.reset(opts.defaultValues);
  }, [opts.defaultValues?.name]);

  return form;
}
