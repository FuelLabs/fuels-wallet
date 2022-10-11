import { cssObj } from '@fuel-ui/css';
import { Button, HelperIcon, Stack } from '@fuel-ui/react';

import { ConnectInfo } from '../../components';

import { LockedRoute, useAccount } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import type { TxRequest } from '~/systems/Transaction';
import {
  TxDetails,
  getCoinInputsFromTx,
  useSimulateTx,
} from '~/systems/Transaction';

type TxApproveProps = {
  tx: TxRequest;
  url: string;
};

export function TxApprove({ tx, url }: TxApproveProps) {
  const { account, isLoading } = useAccount();
  const { result } = useSimulateTx(tx);

  return (
    <LockedRoute>
      <Layout title="Approving Transaction" isLoading={isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          <Stack gap="$4">
            {url && account && <ConnectInfo url={url} account={account} />}
            <Stack gap="$4">
              <HelperIcon as="h2" message="Some message">
                Estimate balance after
              </HelperIcon>
              {tx.inputs && <AssetsAmount amounts={getCoinInputsFromTx(tx)} />}
            </Stack>
            {result && <TxDetails receipts={result.receipts} />}
          </Stack>
        </Layout.Content>
        <Layout.BottomBar>
          <Button color="gray" variant="ghost">
            Cancel
          </Button>
          <Button type="submit" color="accent">
            Approve
          </Button>
        </Layout.BottomBar>
      </Layout>
    </LockedRoute>
  );
}

const styles = {
  content: cssObj({
    '& h2': {
      m: '$0',
      fontSize: '$sm',
      color: '$gray12',
    },
  }),
};
