import { Button } from '@fuel-ui/react';
import { Layout } from '~/systems/Core';
import { useConsolidateCoinsActorRef } from '../../hooks/useConsolidateCoinsActorRef';
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

  const service = useConsolidateCoinsActorRef();

  const handleSubmit = () => {
    service.send({ type: 'CONSOLIDATE_COINS' });
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
