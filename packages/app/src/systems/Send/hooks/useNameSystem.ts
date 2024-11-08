import { OffChainSync, isValidDomain } from '@bako-id/sdk';
import type { Provider } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useNameSystem = (provider?: Provider) => {
  const offChainResolver = useRef<OffChainSync | null>(null);
  const [resolver, setResolver] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const connect = async () => {
      offChainResolver.current = await OffChainSync.create(provider!);
    };

    if (provider) {
      connect();
    }
  }, [provider]);

  useEffect(() => {
    console.log('resolver', {
      name,
      resolver,
    });
  }, [resolver, name]);

  const clear = useCallback(() => {
    setResolver(undefined);
    setName(undefined);
  }, []);

  const getResolver = useCallback(
    debounce((name: string) => {
      const resolverAddress = offChainResolver.current?.getResolver(
        name.replace('@', '')
      );
      getName(resolverAddress!);
      setResolver(resolverAddress);
    }, 300),
    []
  );

  const isName = useCallback((name: string) => {
    return name.startsWith('@') && isValidDomain(name);
  }, []);

  const getName = useCallback((address: string) => {
    const addressName = offChainResolver.current?.getDomain(address);
    setName(addressName ? `@${addressName}` : undefined);
  }, []);

  return {
    handlers: {
      clear,
      isName,
      getName,
      getResolver,
    },
    name,
    resolver,
  };
};
