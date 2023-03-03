/* eslint-disable @typescript-eslint/no-unused-expressions */
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useAccountFormNameObj } from './useAccountFormNameObj';

import type { Maybe } from '~/systems/Core';

export type AccountFormValues = {
  name: string;
};

const DEFAULT_VALUES = {
  name: '',
};

export type UseAccountFormReturn = ReturnType<typeof useAccountForm>;

export type UseAddAccountOpts = {
  defaultValues?: Maybe<AccountFormValues>;
};

export function useAccountForm(opts: UseAddAccountOpts = {}) {
  const nameSchemaObj = useAccountFormNameObj();
  const schema = yup.object({
    name: nameSchemaObj,
  });

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
