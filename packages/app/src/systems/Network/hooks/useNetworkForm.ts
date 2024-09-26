import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { Maybe } from '~/systems/Core';

import { isValidNetworkUrl } from '../utils';

export type NetworkFormValues = {
  name: string;
  url: string;
  explorerUrl?: string;
};

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    url: yup
      .string()
      .test('is-url-valid', 'URL is not valid', isValidNetworkUrl)
      .required('URL is required'),
    explorerUrl: yup
      .string()
      .test('is-url-valid', 'Explorer URL is not valid', (url) => {
        if (!url) return true;
        return isValidNetworkUrl(url);
      })
      .optional(),
  })
  .required();

const DEFAULT_VALUES = {
  name: '',
  url: '',
  explorerUrl: '',
};

export type UseNetworkFormReturn = ReturnType<typeof useNetworkForm>;

export type UseAddNetworkOpts = {
  defaultValues?: Maybe<NetworkFormValues>;
};

export function useNetworkForm(opts: UseAddNetworkOpts = {}) {
  const form = useForm<NetworkFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: opts.defaultValues || DEFAULT_VALUES,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    opts.defaultValues && form.reset(opts.defaultValues);
  }, [opts.defaultValues?.name, opts.defaultValues?.url]);

  return form;
}
