import { cssObj } from '@fuel-ui/css';
import { Flex } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { ReceiverQRCode } from '../../components/QRCode';
import { UserAddressCard } from '../../components/UserAddressCard';

import { useAccount } from '~/systems/Account';
import { Layout, Pages } from '~/systems/Core';

export function Receive() {
  const navigate = useNavigate();
  const { account } = useAccount();
  return (
    <Layout title="Receive">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <Flex css={styles.contentWrapper}>
          <UserAddressCard account={account?.address as string} />
          <ReceiverQRCode account={account?.address as string} />
        </Flex>
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  contentWrapper: cssObj({
    height: '100%',
    flexDirection: 'column',
    gap: '$6',
  }),
};
