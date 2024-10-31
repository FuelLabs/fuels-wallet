import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
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
      .test('is-network-valid', 'Network is not valid', function (url) {
        return (
          !url || this.options.context?.chainInfoError !== 'Invalid network URL'
        );
      })
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
      .mixed<string | number>()
      .transform((value) =>
        value != null && value !== '' ? Number(value) : undefined
      )
      .required('Chain ID is required')
      .test(
        'chainId-match',
        'Informed Chain ID does not match the network Chain ID.',
        function (value) {
          return (
            !value ||
            this.options.context?.chainInfoError !== `Chain ID doesn't match`
          );
        }
      )
      .test(
        'is-numbers-only',
        'Chain ID must contain only numbers',
        (value) => value == null || Number.isInteger(value)
      ),
  })
  .required();

const DEFAULT_VALUES = {
  name: '',
  url: '',
  explorerUrl: '',
  chainId: undefined,
};

export type UseNetworkFormReturn = ReturnType<typeof useNetworkForm>;

export type UseAddNetworkOpts = {
  defaultValues?: Maybe<NetworkFormValues>;
  context?: {
    providerChainId?: number;
    isEditing?: boolean;
    chainInfoError?: string;
  };
};

export function useNetworkForm({ defaultValues, context }: UseAddNetworkOpts) {
  const form = useForm<NetworkFormValues>({
    resolver: yupResolver<NetworkFormValues>(schema),
    reValidateMode: 'onChange',
    mode: 'all',
    resetOptions: {
      keepValues: true,
    },
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
