import { Button } from '@fuel-wallet/ui';
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
  consolidated(state: ConsolidateCoinsMachineState) {
    return state.hasTag('consolidated');
  },
};

export function ConsolidationActions({ onCancel }: ConsolidationActions) {
  const shouldConsolidate = useConsolidateCoinsSelector(
    selectors.shouldConsolidate
  );
  const loading = useConsolidateCoinsSelector(selectors.loading);
  const consolidating = useConsolidateCoinsSelector(selectors.consolidating);
  const consolidated = useConsolidateCoinsSelector(selectors.consolidated);

  const handleSubmit = () => {
    store.send(Services.consolidateCoins, { type: 'CONSOLIDATE_COINS' });
  };

  if (consolidated) {
    return (
      <Layout.BottomBar>
        <Button
          intent="primary"
          onPress={() =>
            store.send(Services.consolidateCoins, { type: 'DONE' })
          }
        >
          Done
        </Button>
      </Layout.BottomBar>
    );
  }

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
        Consolidate
      </Button>
    </Layout.BottomBar>
  );
}
