import { cssObj } from '@fuel-ui/css';
import { Flex } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { ReceiverQRCode } from '../../components/QRCode/QRCode';
import { UserAddressCard } from '../../components/UserAddressCard/UserAddressCard';

import { Layout, Pages } from '~/systems/Core';

export function Receive() {
  const navigate = useNavigate();
  return (
    <Layout title="Receive">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <Flex css={styles.contentWrapper}>
          <UserAddressCard />
          <ReceiverQRCode />
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
