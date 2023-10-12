/* eslint-disable @typescript-eslint/no-explicit-any */

import { yupResolver } from '@hookform/resolvers/yup';
import { isB256 } from 'fuels';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { Maybe } from '~/systems/Core';

export type AssetFormValues = {
  name: string;
  assetId: string;
  decimals: number;
  imageUrl?: string;
  symbol: string;
};

function isValidId(id: any) {
  return isB256(id);
}

function isValidUrl(url: any) {
  if (url === '') return true;
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
}

const schema = yup
  .object({
    name: yup.string().max(20).required('Name is required'),
    assetId: yup
      .string()
      .test('is-id-valid', 'ID is not valid', isValidId)
      .required('Asset ID is required'),
    symbol: yup.string().max(6).required('Symbol is required'),
    decimals: yup
      .number()
      .typeError('Decimals is required')
      .min(0)
      .max(19)
      .required('Decimals is required'),
    imageUrl: yup.string().test('is-url-valid', 'URL is not valid', isValidUrl),
  })
  .required();

const DEFAULT_VALUES = {
  assetId: '',
  contractId: '',
  name: '',
  imageUrl: '',
  decimals: 0,
  symbol: '',
};

export type UseAssetFormReturn = ReturnType<typeof useAssetForm>;

export type UseAddAssetOpts = {
  defaultValues?: Maybe<AssetFormValues>;
};

export function useAssetForm(opts: UseAddAssetOpts = {}) {
  const form = useForm<AssetFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: opts.defaultValues || DEFAULT_VALUES,
  });

  useEffect(() => {
    opts.defaultValues && form.reset(opts.defaultValues);
  }, [JSON.stringify(opts.defaultValues)]);

  return form;
}
