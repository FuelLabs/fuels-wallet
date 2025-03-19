import type { NetworkData } from '@fuel-wallet/types';
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
      .default('')
      .test('is-required', 'Name is required', function (value) {
        return !this.options?.context?.isEditing || !!value;
      }),
    url: yup
      .string()
      .default('')
      .test('is-url-valid', 'URL is not valid', isValidNetworkUrl)
      .test('is-network-valid', 'Network is not valid', function (url) {
        return (
          !url || this.options.context?.chainInfoError !== 'Invalid network URL'
        );
      })
      .required('URL is required'),
    explorerUrl: yup
      .string()
      .default('')
      .test(
        'is-url-valid',
        'Explorer URL is not valid',
        (url) => !url || isValidNetworkUrl(url)
      )
      .optional(),
    chainId: yup
      .string()
      .default('')
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
        (value) => {
          if (!value) return true;
          const num = Number(value);
          return !Number.isNaN(num) && Number.isInteger(num);
        }
      ),
  })
  .required();

const DEFAULT_VALUES: NetworkFormValues = {
  name: '',
  url: '',
  explorerUrl: '',
  chainId: '',
};

export type UseNetworkFormReturn = ReturnType<typeof useNetworkForm>;

export type UseAddNetworkOpts = {
  defaultValues?: Maybe<Partial<NetworkData>>;
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
    defaultValues: defaultValues
      ? {
          ...DEFAULT_VALUES,
          ...defaultValues,
          chainId: defaultValues.chainId?.toString() || '',
        }
      : DEFAULT_VALUES,
    context,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        chainId: defaultValues.chainId?.toString() || '',
      });
    }
  }, [defaultValues, form]);

  return form;
}
