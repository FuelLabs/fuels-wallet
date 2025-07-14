import { useNavigate } from 'react-router-dom';
import { Layout, Pages } from '~/systems/Core';
import { ConsolidateCoinsProvider } from '../../components/ConsolidateCoinsProvider/ConsolidateCoinsProvider';
import { ConsolidationActions } from '../../components/ConsolidationActions/ConsolidationActions';
import { ConsolidationDetails } from '../../components/ConsolidationDetails/ConsolidationDetails';

export function BundlesPage() {
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(Pages.index());
  };

  return (
    <ConsolidateCoinsProvider>
      <Layout title="Coins">
        <Layout.TopBar onBack={onCancel} />
        <ConsolidationDetails />
        <ConsolidationActions onCancel={onCancel} />
      </Layout>
    </ConsolidateCoinsProvider>
  );
}
