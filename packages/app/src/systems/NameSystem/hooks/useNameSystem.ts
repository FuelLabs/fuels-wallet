import { useEffect, useRef } from 'react';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { NameSystemService } from '../services';

export const useNameSystem = () => {
  const nameSystem = useRef<NameSystemService | null>(null);
  const provider = useProvider();

  useEffect(() => {
    if (!provider) return;

    NameSystemService.connect(provider!).then((instance) => {
      nameSystem.current = instance;
    });
  }, [provider]);

  return nameSystem.current;
};
