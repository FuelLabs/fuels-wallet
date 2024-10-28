import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { Maybe } from '~/systems/Core';

import { isValidNetworkUrl } from '../utils';

export type NetworkFormValues = yup.InferType<typeof schema>;

const schema = yup
  .object({
    name: yup
      .string()
      .test('is-required', 'Name is required', function (value) {
        return !this.options?.context?.isEditing || !!value;
      }),
    url: yup
      .string()
      .test('is-url-valid', 'URL is not valid', isValidNetworkUrl)
      .required('URL is required'),
    explorerUrl: yup
      .string()
      .test(
        'is-url-valid',
        'Explorer URL is not valid',
        (url) => !url || isValidNetworkUrl(url)
      )
      .optional(),
    chainId: yup
      .string()
      .when(
        'acceptRisk',
        (_acceptRisk: Array<boolean>, schema: yup.StringSchema) => {
          const acceptRisk = !!_acceptRisk?.[0];
          return !acceptRisk
            ? schema.required('Chain ID is required')
            : schema.notRequired();
        }
      )
      .test(
        'chainId-match',
        'Chain ID does not match the provider Chain ID.',
        function (value) {
          const providerChainId = this.parent.providerChainId;
          return !value || !providerChainId || value === providerChainId;
        }
      )
      .test(
        'is-numbers-only',
        'Chain ID must contain only numbers',
        (value) => !value || /^\d+$/.test(value)
      ),
    acceptRisk: yup.boolean().notRequired(),
  })
  .required();

const DEFAULT_VALUES = {
  name: '',
  url: '',
  explorerUrl: '',
  chainId: '',
  acceptRisk: false,
};

export type UseNetworkFormReturn = ReturnType<typeof useNetworkForm>;

export type UseAddNetworkOpts = {
  defaultValues?: Maybe<NetworkFormValues>;
  context?: {
    providerChainId?: string;
    isEditing?: boolean;
  };
};

export function useNetworkForm({ defaultValues, context }: UseAddNetworkOpts) {
  const form = useForm<NetworkFormValues>({
    resolver: yupResolver<NetworkFormValues>(schema),
    reValidateMode: 'onChange',
    mode: 'onBlur',
    defaultValues: defaultValues || DEFAULT_VALUES,
    context,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return form;
}
