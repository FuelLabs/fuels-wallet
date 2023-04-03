import { Box } from '@fuel-ui/react';

import { UnlockCard } from '../components/UnlockCard';
import { useUnlock } from '../hooks';

import { Layout } from '~/systems/Core';

export function UnlockPage() {
  const { isLoading, isReseting, error, handlers } = useUnlock();

  return (
    <Layout title="Unlock Wallet">
      <Box css={{ padding: '$3' }}>
        <UnlockCard
          unlockError={error}
          isReseting={isReseting}
          isLoading={isLoading}
          onUnlock={(password) => {
            handlers.unlock({ password });
          }}
          onReset={handlers.reset}
        />
      </Box>
    </Layout>
  );
}
