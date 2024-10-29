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
      .number()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value
      )
      .when('acceptRisk', (_acceptRisk: Array<boolean>, schema) => {
        const acceptRisk = !!_acceptRisk?.[0];
        return !acceptRisk
          ? schema.required('Chain ID is required')
          : schema.notRequired();
      })
      .test(
        'chainId-match',
        'Chain ID does not match the provider Chain ID.',
        function (value) {
          const providerChainId = this.options.context?.providerChainId;
          return (
            value == null ||
            providerChainId == null ||
            value === providerChainId
          );
        }
      )
      .test(
        'is-numbers-only',
        'Chain ID must contain only numbers',
        (value) => value == null || Number.isInteger(value)
      ),
    acceptRisk: yup.boolean().notRequired(),
  })
  .required();

const DEFAULT_VALUES = {
  name: '',
  url: '',
  explorerUrl: '',
  chainId: undefined,
  acceptRisk: false,
};

export type UseNetworkFormReturn = ReturnType<typeof useNetworkForm>;

export type UseAddNetworkOpts = {
  defaultValues?: Maybe<NetworkFormValues>;
  context?: {
    providerChainId?: number;
    isEditing?: boolean;
  };
};

export function useNetworkForm({ defaultValues, context }: UseAddNetworkOpts) {
  const form = useForm<NetworkFormValues>({
    resolver: yupResolver<NetworkFormValues>(schema),
    reValidateMode: 'onChange',
    mode: 'all',
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
