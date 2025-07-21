import { Box, Text } from '@fuel-ui/react';
import { Layout } from '~/systems/Core';
import { useBaseAsset } from '~/systems/Transaction/hooks/useBaseAsset';
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
  const baseAsset = useBaseAsset();

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

  const _assetName = baseAsset?.name || 'coins';
  const assetSymbol = baseAsset?.symbol || '';

  return (
    <Layout.Content>
      <Box css={{ mt: '$4', mb: '$4' }}>
        <Box css={{ mb: '$4' }}>
          <Text
            as="h3"
            css={{ mb: '$2', fontWeight: '$semibold', color: '$textHeading' }}
          >
            Account Consolidation Required
          </Text>
          <Text css={{ mb: '$3', color: '$gray11' }}>
            This happens when you have many small transactions that create too
            many individual coins, making your account difficult to use.
          </Text>
        </Box>

        <Box css={{ mb: '$4' }}>
          <Text
            as="h3"
            css={{ mb: '$2', fontWeight: '$semibold', color: '$textHeading' }}
          >
            What is Coin Consolidation?
          </Text>
          <Text css={{ mb: '$3', color: '$gray11' }}>
            It's a process to combine many small coins into fewer, larger ones.
          </Text>
        </Box>

        <Box css={{ mb: '$4' }}>
          <Text
            as="h3"
            css={{ mb: '$2', fontWeight: '$semibold', color: '$textHeading' }}
          >
            Consolidation Summary
          </Text>
          <Text css={{ color: '$gray11' }}>
            {coins.length > 0
              ? `${coins.length} coins of ${assetSymbol} will be consolidated. This will require ${txs.length} transactions`
              : 'No coins to consolidate'}
          </Text>
        </Box>
      </Box>
    </Layout.Content>
  );
}
