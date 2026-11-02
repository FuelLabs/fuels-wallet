import { useNavigate } from 'react-router-dom';
import { Services, store } from '~/store';
import { Layout, Pages } from '~/systems/Core';
import { ConsolidationActions } from '../../components/ConsolidationActions/ConsolidationActions';
import { ConsolidationDetails } from '../../components/ConsolidationDetails/ConsolidationDetails';
import { ConsolidationProgress } from '../../components/ConsolidationProgress/ConsolidationProgress';
import { useConsolidateCoinsSelector } from '../../hooks/useConsolidateCoinsSelector';

export function BundlesPage() {
  const navigate = useNavigate();
  const isRunning = useConsolidateCoinsSelector(
    (state) => state.hasTag('consolidating') || state.hasTag('consolidated')
  );

  const onCancel = () => {
    navigate(Pages.index());
  };

  store.useUpdateMachineConfig(Services.consolidateCoins, {
    actions: {
      navigateToHome() {
        navigate(Pages.index());
      },
    },
  });

  return (
    <Layout title="Coins">
      <Layout.TopBar onBack={onCancel} />
      {isRunning ? <ConsolidationProgress /> : <ConsolidationDetails />}
      <ConsolidationActions onCancel={onCancel} />
    </Layout>
  );
}
