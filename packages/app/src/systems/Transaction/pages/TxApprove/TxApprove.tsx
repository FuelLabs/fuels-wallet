import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Button, Dialog } from '@fuel-ui/react';
import { OperationName } from 'fuels';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { useTransactionRequest } from '~/systems/DApp';
import { OverlayDialogTopbar } from '~/systems/Overlay';
import { TxContent } from '~/systems/Transaction';
import { getContractInfo } from '../../utils/getContractInfo';

export const TxApprove = () => {
  const ctx = useTransactionRequest();
  const navigate = useNavigate();
  const { isLoading: isLoadingAssets } = useAssets();
  const isSuccess = ctx.status('success');
  const isLoading =
    ctx.status('loading') || ctx.status('sending') || isLoadingAssets;
  const [contractInfo, setContractInfo] = useState<{
    name: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    if (ctx.txSummarySimulated?.operations?.length) {
      const contractOp = ctx.txSummarySimulated.operations.find(
        (op) => op.name === OperationName.contractCall
      );
      if (contractOp?.to?.address) {
        getContractInfo(contractOp.to.address).then(setContractInfo);
      }
    }
  }, [ctx.txSummarySimulated?.operations]);

  const goToWallet = () => {
    ctx.handlers.closeDialog();
    navigate(Pages.index());
  };

  return (
    <>
      <OverlayDialogTopbar
        onClose={isSuccess ? goToWallet : ctx.handlers.closeDialog}
      >
        <Box.Flex css={styles.contractHeader}>
          <Avatar
            size="sm"
            src={contractInfo?.image}
            name={contractInfo?.name || 'Unknown Contract'}
          />
          <span>{contractInfo?.name || ctx.title}</span>
        </Box.Flex>
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        {!ctx.txSummarySimulated && <TxContent.Loader />}
        {ctx.shouldShowTxSimulated && (
          <TxContent.Info
            showDetails
            tx={ctx.txSummarySimulated}
            isLoading={isLoading}
            errors={ctx.errors.simulateTxErrors}
            isConfirm
          />
        )}
        {ctx.shouldShowTxExecuted && (
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
      <Dialog.Footer>
        {ctx.shouldShowActions && (
          <>
            <Button
              variant="ghost"
              isDisabled={isLoading}
              onPress={ctx.handlers.closeDialog}
            >
              Back
            </Button>
            <Button
              intent="primary"
              isLoading={isLoading}
              isDisabled={ctx.shouldDisableApproveBtn}
              onPress={ctx.handlers.approve}
            >
              Submit
            </Button>
          </>
        )}
      </Dialog.Footer>
    </>
  );
};

const styles = {
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'scroll !important',
    paddingLeft: '$4',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  }),
  contractHeader: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',

    '& span': {
      fontSize: '$sm',
      fontWeight: '$medium',
    },
  }),
};
