import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { animations, Layout, Pages } from '~/systems/Core';
import type { UseTransactionRequestReturn } from '~/systems/DApp';
import { TxContent } from '~/systems/DApp';
import { useNetworks } from '~/systems/Network/hooks';
import { NetworkScreen } from '~/systems/Network/machines';

export type SendSuccessProps = {
  txRequest: UseTransactionRequestReturn;
};

export function SendSuccess({ txRequest }: SendSuccessProps) {
  const navigate = useNavigate();
  const { selectedNetwork: network } = useNetworks({
    type: NetworkScreen.list,
  });

  return (
    <Layout.Content {...animations.slideInTop()} css={styles.content}>
      <TxContent.Success
        txHash={txRequest.response?.approvedTx?.id}
        providerUrl={network?.url}
        footer={
          <Button
            color="accent"
            variant="ghost"
            onPress={() => navigate(Pages.index())}
            css={styles.actionBtn}
          >
            Go back to Wallet
          </Button>
        }
      />
    </Layout.Content>
  );
}

const styles = {
  actionBtn: cssObj({
    mt: '$4',
  }),
  content: cssObj({
    '.content_header': {
      px: '$8',
    },
  }),
};
