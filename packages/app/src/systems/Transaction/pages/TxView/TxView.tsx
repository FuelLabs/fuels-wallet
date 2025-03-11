import { cssObj } from '@fuel-ui/css';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, coreStyles } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';
import type { SendFormValues } from '~/systems/Send/hooks';
import { TxStatusAlert } from '../../components';
import { TxContent } from '../../components/TxContent/TxContent';
import { useTxResult } from '../../hooks';

export function TxView() {
  const txIdQueryParam = useParams<{ txId: string }>().txId;
  const networks = useNetworks();
  const providerUrl = networks?.selectedNetwork?.url;
  const navigate = useNavigate();
  const { txResult, ...ctx } = useTxResult({
    providerUrl,
    txId: txIdQueryParam,
    waitProviderUrl: true,
  });
  const form = useForm<SendFormValues>();

  return (
    <Layout
      title="Transaction"
      isLoading={ctx.isFetching || ctx.isFetchingResult}
    >
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content css={styles.content} noScroll>
        {ctx.shouldShowAlert && (
          <TxStatusAlert txStatus={txResult?.status} error={ctx.error} />
        )}
        {!txResult && <TxContent.Loader />}
        {txResult && (
          <FormProvider {...form}>
            <TxContent.Info tx={txResult} showDetails={ctx.shouldShowTxFee} />
          </FormProvider>
        )}
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    borderTop: '1px solid $gray6',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    backgroundColor: '$intentsBase3',
    padding: '$2 0 $2 $3',
    overflowY: 'scroll !important',
    '&::-webkit-scrollbar': {
      width: '$3',
      backgroundColor: 'transparent',
    },
  }),
  contentInner: cssObj({}),
};
