import { Box } from '@fuel-ui/react';

import { UnlockCard } from '../components/UnlockCard';
import { useUnlock } from '../hooks';

import { Layout } from '~/systems/Core';

export function UnlockPage() {
  const { isLoading, error, handlers } = useUnlock();

  return (
    <Layout title="Unlock Wallet">
      <Box css={{ padding: '$3' }}>
        <UnlockCard
          unlockError={error}
          isLoading={isLoading}
          onUnlock={(password) => {
            handlers.unlock({ password });
          }}
        />
      </Box>
    </Layout>
  );
}
