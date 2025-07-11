import { Button, Text } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { Layout, Pages } from '~/systems/Core';
import { ConsolidateCoinsProvider } from '../../components/ConsolidateCoinsProvider/ConsolidateCoinsProvider';
import { useConsolidateCoinsSelector } from '../../hooks/useConsolidateCoinsSelector';

// @TODO: Isolate it
const Test = () => {
  const providerUrl = useConsolidateCoinsSelector(
    (state) => state.context.providerUrl
  );
  const account = useConsolidateCoinsSelector((state) => state.context.account);
  const loading = useConsolidateCoinsSelector((state) => {
    return state.hasTag('loading');
  });
  const assetId = useConsolidateCoinsSelector((state) => state.context.assetId);
  const shouldConsolidate = useConsolidateCoinsSelector(
    (state) => state.context.shouldConsolidate
  );

  const txs = useConsolidateCoinsSelector((state) => state.context.txs);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <div>
      <Text>{providerUrl || ' empty'}</Text>
      <Text>{account?.address || ' empty'}</Text>
      <Text>{assetId || ' empty'}</Text>
      <Text>{shouldConsolidate ? 'true' : 'false'}</Text>
      <Text>{txs.length || ' empty'}</Text>
    </div>
  );
};

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
          <Test />
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
