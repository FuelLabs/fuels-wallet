import { Flex } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

// import { ReceiverQRCode } from '../../components/QRCode/QRCode';

import { ReceiverQRCode } from '../../components/QRCode/QRCode';
import { UserAddressCard } from '../../components/UserAddressCard/UserAddressCard';

import { Layout, Pages } from '~/systems/Core';

export function Receive() {
  const navigate = useNavigate();
  return (
    <Layout title="Receive">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <Flex css={{ height: '100%', flexDirection: 'column', gap: '$6' }}>
          <UserAddressCard />
          <ReceiverQRCode />
        </Flex>
      </Layout.Content>
    </Layout>
  );
}
