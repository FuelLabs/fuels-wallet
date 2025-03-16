import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog } from '@fuel-ui/react';
import { useAssets } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { coreStyles } from '~/systems/Core/styles';
import { useTransactionRequest } from '~/systems/DApp';
import { TxContent } from '../../components/TxContent/TxContent';

export const TxApprove = () => {
  const ctx = useTransactionRequest();
  const { isLoading: isLoadingAssets } = useAssets();
  const isLoading =
    ctx.status('loading') || ctx.status('sending') || isLoadingAssets;

  return (
    <Box css={styles.wrapper}>
      <Layout.TopBar type={TopBarType.txApprove} />
      <Dialog.Description as="div" css={styles.description}>
        {ctx.shouldShowTxSimulated && ctx.txSummarySimulated && (
          <TxContent.Info
            showDetails
            tx={ctx.txSummarySimulated}
            errors={ctx.errors.simulateTxErrors}
            footer={
              ctx.status('failed') && (
                <Button
                  size="sm"
                  variant="ghost"
                  intent="error"
                  onPress={ctx.handlers.tryAgain}
                >
                  Try again
                </Button>
              )
            }
          />
        )}
        {ctx.shouldShowTxExecuted && ctx.txSummaryExecuted && (
          <TxContent.Info
            showDetails
            tx={ctx.txSummaryExecuted}
            txStatus={ctx.executedStatus()}
            footer={
              ctx.status('failed') && (
                <Button
                  size="sm"
                  variant="ghost"
                  intent="error"
                  onPress={ctx.handlers.tryAgain}
                >
                  Try again
                </Button>
              )
            }
          />
        )}
      </Dialog.Description>
      <Dialog.Footer css={styles.footer}>
        {ctx.shouldShowActions && (
          <>
            <Button
              variant="ghost"
              isDisabled={isLoading}
              onPress={ctx.handlers.closeDialog}
              css={styles.footerButton}
            >
              Back
            </Button>
            <Button
              intent="primary"
              isLoading={isLoading}
              isDisabled={ctx.shouldDisableApproveBtn}
              onPress={ctx.handlers.approve}
              css={styles.footerButton}
            >
              Submit
            </Button>
          </>
        )}
      </Dialog.Footer>
    </Box>
  );
};

const styles = {
  wrapper: cssObj({
    flex: 1,
    ...coreStyles.scrollable('$intentsBase3'),
    borderTop: '1px solid $gray6',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    backgroundColor: '$intentsBase3',

    'html[class="fuel_dark-theme"] &': {
      backgroundColor: '#111',
    },
  }),
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'auto !important',
    padding: '0 $2 0 $2',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  }),
  footer: cssObj({
    p: '$4 $5',
    borderTop: '1px solid $gray7',
  }),
  footerButton: cssObj({
    mt: '$4',
  }),
};
