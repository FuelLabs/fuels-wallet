import { UnlockCard } from '../components/UnlockCard';
import { useUnlock } from '../hooks';

import { Layout } from '~/systems/Core';

export function UnlockPage() {
  const { isLoading, isReseting, error, handlers } = useUnlock();

  return (
    <Layout title="Unlock Wallet">
      <UnlockCard
        unlockError={error}
        isReseting={isReseting}
        isLoading={isLoading}
        onUnlock={(password) => {
          handlers.unlock({ password });
        }}
        onReset={handlers.reset}
      />
    </Layout>
  );
}
