import { Button, Text } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { store } from '~/store';
import { ContentHeader, Layout, Pages } from '~/systems/Core';
import type { UseTransactionRequestReturn } from '~/systems/DApp';
import { TxContent, TxHeader } from '~/systems/Transaction';

export type SendConfirmProps = {
  txRequest: UseTransactionRequestReturn;
};

export function SendConfirm({ txRequest }: SendConfirmProps) {
  const amountSent = txRequest.ethAmountSent;
  const isDone = txRequest.status('success') || txRequest.status('failed');
  const navigate = useNavigate();

  const goToHome = () => {
    store.updateAccounts();
    navigate(Pages.index());
  };

  return (
    <Layout.Content>
      <TxContent.Info
        showDetails
        tx={txRequest.tx}
        txStatus={txRequest.approveStatus()}
        amount={amountSent}
        header={
          <>
            {txRequest.status('waitingApproval') && (
              <ContentHeader title="Confirm before approving">
                <Text>
                  Carefully check if all details in your transaction are correct
                </Text>
              </ContentHeader>
            )}
            {isDone && (
              <TxHeader
                id={txRequest.tx?.id}
                type={txRequest.tx?.type}
                status={txRequest.tx?.status || txRequest.approveStatus()}
                providerUrl={txRequest.providerUrl}
              />
            )}
          </>
        }
        footer={
          <>
            {txRequest.status('success') && (
              <Button
                size="sm"
                variant="ghost"
                color="accent"
                onPress={goToHome}
              >
                Back to wallet
              </Button>
            )}
            {txRequest.status('failed') && (
              <Button
                size="sm"
                variant="ghost"
                color="red"
                onPress={txRequest.handlers.tryAgain}
              >
                Try again
              </Button>
            )}
          </>
        }
      />
    </Layout.Content>
  );
}
