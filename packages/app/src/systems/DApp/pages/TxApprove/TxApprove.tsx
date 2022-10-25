import { cssObj } from '@fuel-ui/css';
import { Button, Heading, HelperIcon, Stack, Text } from '@fuel-ui/react';

import { ConnectInfo, UnlockDialog } from '../../components';

import { useAccount } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import {
  TxDetails,
  getCoinOutputsFromTx,
  useTransaction,
} from '~/systems/Transaction';

export type TxApproveProps = {
  id: string;
  url: string;
};

export function TxApprove({ id, url }: TxApproveProps) {
  const { account, isLoading } = useAccount();
  const {
    txRequest,
    simulateResult,
    handlers,
    isSent,
    isLoading: isLoadingTx,
  } = useTransaction(id!);

  return (
    <Layout title="New Transaction" isLoading={isLoading}>
      <Layout.TopBar type={TopBarType.external} />
      <Layout.Content css={styles.content}>
        <UnlockDialog isFullscreen onUnlock={() => {}} isOpen={false} />
        {!isLoading && !isSent && (
          <Stack gap="$4">
            {url && account && <ConnectInfo origin={url} account={account} />}
            <Stack gap="$2">
              <HelperIcon as="h2" message="Some message">
                Assets amount
              </HelperIcon>
              {txRequest?.outputs && (
                <AssetsAmount amounts={getCoinOutputsFromTx(txRequest)} />
              )}
            </Stack>
            {simulateResult && <TxDetails receipts={simulateResult.receipts} />}
          </Stack>
        )}
        {isSent && (
          <Stack>
            <Heading as="h4">Transaction sent</Heading>
            <Text>
              Transaction sent successfully, you can open your wallet and check
              its status right now!
            </Text>
          </Stack>
        )}
      </Layout.Content>
      <Layout.BottomBar>
        <Button color="gray" variant="ghost">
          Close
        </Button>
        <Button
          type="submit"
          color="accent"
          onPress={handlers.approve}
          isLoading={isLoadingTx}
          isDisabled={isSent}
        >
          Send
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    '& h2': {
      m: '$0',
      fontSize: '$sm',
      color: '$gray12',
    },
    '& h4': {
      m: '$0',
    },
  }),
};
