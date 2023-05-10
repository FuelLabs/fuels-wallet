/* eslint-disable @typescript-eslint/no-unused-expressions */
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import type { Maybe } from '~/systems/Core';

export type NetworkFormValues = {
  name: string;
  url: string;
};

function isValidUrl(url?: string) {
  if (!url) return false;
  // Note: new URL('https://graphql') returns `true`
  const pattern = new RegExp(
    '^(https?:\\/\\/)' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))|' +
      'localhost' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return pattern.test(url) && url.endsWith('/graphql');
}

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    url: yup
      .string()
      .test('is-url-valid', 'URL is not valid', isValidUrl)
      .required('URL is required'),
  })
  .required();

const DEFAULT_VALUES = {
  name: '',
  url: '',
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

  useEffect(() => {
    opts.defaultValues && form.reset(opts.defaultValues);
  }, [opts.defaultValues?.name, opts.defaultValues?.url]);

  return form;
}
