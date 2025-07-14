import { Text } from '@fuel-ui/react';
import { Layout } from '~/systems/Core';
import { useConsolidateCoinsSelector } from '../../hooks/useConsolidateCoinsSelector';
import type { ConsolidateCoinsMachineState } from '../../machines/consolidateCoinsMachine';

const selectors = {
  providerUrl(state: ConsolidateCoinsMachineState) {
    return state.context.providerUrl;
  },
  account(state: ConsolidateCoinsMachineState) {
    return state.context.account;
  },
  coins(state: ConsolidateCoinsMachineState) {
    return state.context.coins;
  },
  shouldConsolidate(state: ConsolidateCoinsMachineState) {
    return state.context.shouldConsolidate;
  },
  loading(state: ConsolidateCoinsMachineState) {
    return state.hasTag('loading');
  },
};

export function ConsolidationDetails() {
  const loading = useConsolidateCoinsSelector(selectors.loading);
  const shouldConsolidate = useConsolidateCoinsSelector(
    selectors.shouldConsolidate
  );
  const coins = useConsolidateCoinsSelector(selectors.coins);

  const txs = useConsolidateCoinsSelector(
    (state) => state.context.consolidation.txs
  );

  if (loading) {
    return (
      <Layout.Content>
        <Text>Loading...</Text>
      </Layout.Content>
    );
  }

  if (!shouldConsolidate) {
    return (
      <Layout.Content>
        <Text>User cannot consolidate</Text>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content>
      <Text css={{ mt: '$4', mb: '$2' }}>
        {coins.length > 0
          ? `${coins.length} coins to consolidate in ${txs.length} txs`
          : 'No txs to consolidate'}
      </Text>
      <Text>
        @TODO: Improve this screen... Display fees, txs, amounts, etc.
      </Text>
    </Layout.Content>
  );
}
