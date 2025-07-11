import { Button, Text } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { Layout, Pages } from '~/systems/Core';
import { ConsolidateCoinsProvider } from '../../components/ConsolidateCoinsProvider/ConsolidateCoinsProvider';

export function BundlesPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(Pages.index());
  };

  return (
    <ConsolidateCoinsProvider>
      <Layout title="Coins">
        <Layout.TopBar onBack={goBack} />

        <Layout.Content>
          <Text>BundlesPage</Text>
        </Layout.Content>

        <Layout.BottomBar>
          <Button variant="ghost" onPress={goBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            intent="primary"
            // @TODO: Integration with state machine
            // isDisabled={
            //   !readyToSend || hasFormErrors || !amount || amount.lte(0)
            // }
            // isLoading={status('loading') || status('loadingTx')}
          >
            Merge
          </Button>
        </Layout.BottomBar>
      </Layout>
    </ConsolidateCoinsProvider>
  );
}
