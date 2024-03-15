import type {
  DefinedUseQueryResult,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type ExcludeData<T> = Omit<T, 'data'>;

type NamedUseQueryResult<
  TName extends string,
  TQueryFnData = unknown,
  TError = unknown,
> = ExcludeData<UseQueryResult<TQueryFnData, TError>> & {
  [key in TName]: UseQueryResult<TQueryFnData, TError>['data'];
};

type DefinedNamedUseQueryResult<
  TName extends string,
  TQueryFnData = unknown,
  TError = unknown,
> = ExcludeData<DefinedUseQueryResult<TQueryFnData, TError>> & {
  [key in TName]: DefinedUseQueryResult<TQueryFnData, TError>['data'];
};

function createProxyHandler<
  TName extends string,
  TData = unknown,
  TError = unknown,
>(name: TName) {
  const handlers: ProxyHandler<UseQueryResult<TData, TError>> = {
    get(target, prop) {
      if (prop === name) {
        return target.data;
      }

      return Reflect.get(target, prop);
    },
  };

  return handlers;
}

/**
 * When initialData is not provided "data" will be always TQueryFnData | undefined.
 * It might need some type checking to be sure that the data is not undefined.
 */
export function useNamedQuery<
  TName extends string,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  name: TName,
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'initialData'
  > & { initialData?: () => undefined }
): NamedUseQueryResult<TName, TData, TError>;

/**
 * When initialData is provided "data" will be always TQueryFnData.
 * Never undefined.
 */
export function useNamedQuery<
  TName extends string,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  name: TName,
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'initialData'
  > & { initialData: TQueryFnData | (() => TQueryFnData) }
): DefinedNamedUseQueryResult<TName, TData, TError>;

/**
 * useNamedQuery is a wrapper for useQuery that allows you to override the "data" property with a custom name.
 *
 * @param name a identifier to override "data" property with this name
 * @param options UseQueryOptions
 * @returns useQuery
 */
export function useNamedQuery<
  TName extends string,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  name: TName,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): NamedUseQueryResult<TName, TData, TError> {
  const query = useQuery(options);

  const proxy = useMemo(() => {
    return new Proxy(query, createProxyHandler(name)) as NamedUseQueryResult<
      TName,
      TData,
      TError
    >;
  }, [name, query]);

  return proxy;
}
