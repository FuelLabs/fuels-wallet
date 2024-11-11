import { isValidDomain } from '@bako-id/sdk';
import { Address } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

import { useNameSystem } from './useNameSystem';

export const useNameSystemResolver = () => {
  const nameSystem = useNameSystem();
  const [resolver, setResolver] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  const clear = useCallback(() => {
    setResolver(undefined);
    setName(undefined);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getResolver = useCallback(
    debounce((name: string) => {
      const resolverAddress = nameSystem?.resolver(name.replace('@', ''));
      if (resolverAddress) {
        setName(name);
        setResolver(Address.fromString(resolverAddress!).toString());
      }
    }, 300),
    [nameSystem]
  );

  const isName = useCallback((name: string) => {
    return name.startsWith('@') && isValidDomain(name);
  }, []);

  const getName = useCallback(
    (address: string) => {
      const addressName = nameSystem?.name(
        Address.fromString(address).toB256()
      );
      setName(addressName);
    },
    [nameSystem]
  );

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
