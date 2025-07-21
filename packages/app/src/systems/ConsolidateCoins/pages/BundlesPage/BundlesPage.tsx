import { useNavigate } from 'react-router-dom';
import { Services, store } from '~/store';
import { Layout, Pages } from '~/systems/Core';
import { ConsolidationActions } from '../../components/ConsolidationActions/ConsolidationActions';
import { ConsolidationDetails } from '../../components/ConsolidationDetails/ConsolidationDetails';

export function BundlesPage() {
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(Pages.index());
  };

  // Configure the machine to navigate to Home after successful consolidation
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
      <ConsolidationDetails />
      <ConsolidationActions onCancel={onCancel} />
    </Layout>
  );
}
