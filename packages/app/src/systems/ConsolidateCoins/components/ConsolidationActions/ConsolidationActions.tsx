import { Button } from '@fuel-ui/react';
import { store } from '~/store';
import { Services } from '~/store';
import { Layout } from '~/systems/Core';
import { useConsolidateCoinsSelector } from '../../hooks/useConsolidateCoinsSelector';
import type { ConsolidateCoinsMachineState } from '../../machines/consolidateCoinsMachine';

interface ConsolidationActions {
  onCancel: () => void;
}

const selectors = {
  shouldConsolidate(state: ConsolidateCoinsMachineState) {
    return state.context.shouldConsolidate;
  },
  loading(state: ConsolidateCoinsMachineState) {
    return state.hasTag('loading');
  },
  consolidating(state: ConsolidateCoinsMachineState) {
    return state.hasTag('consolidating');
  },
};

export function ConsolidationActions({ onCancel }: ConsolidationActions) {
  const shouldConsolidate = useConsolidateCoinsSelector(
    selectors.shouldConsolidate
  );
  const loading = useConsolidateCoinsSelector(selectors.loading);
  const consolidating = useConsolidateCoinsSelector(selectors.consolidating);

  const handleSubmit = () => {
    store.send(Services.consolidateCoins, { type: 'CONSOLIDATE_COINS' });
  };

  return (
    <Layout.BottomBar>
      <Button variant="ghost" onPress={onCancel}>
        Cancel
      </Button>
      <Button
        type="submit"
        intent="primary"
        isDisabled={!shouldConsolidate || loading}
        isLoading={consolidating}
        onPress={handleSubmit}
      >
        Submit
      </Button>
    </Layout.BottomBar>
  );
}
