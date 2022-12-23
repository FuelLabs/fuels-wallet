import { AnimatePresence } from 'framer-motion';

import { ConnectionEdit, ConnectionList } from '../../components';
import { useConnections } from '../../hooks';
import { ConnectionScreen } from '../../machines';

import { Layout } from '~/systems/Core';

export function Connections() {
  const state = useConnections();
  return (
    <Layout title={state.title!}>
      <Layout.TopBar onBack={state.handlers.cancel} />
      <AnimatePresence initial={false} mode="wait">
        {state.screen === ConnectionScreen.list ? (
          <ConnectionList {...state} />
        ) : (
          <ConnectionEdit {...state} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
