import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ReceiverQRCode } from '../../components/QRCode';
import { UserAddressCard } from '../../components/UserAddressCard';

import { useAccounts } from '~/systems/Account';
import { Layout, Pages, animations } from '~/systems/Core';

const MotionFlex = motion(Box.Flex);

export function Receive() {
  const navigate = useNavigate();
  const { account } = useAccounts();
  return (
    <Layout title="Receive">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        {account?.address && (
          <MotionFlex {...animations.slideInTop()} css={styles.contentWrapper}>
            <UserAddressCard address={account?.address} />
            <ReceiverQRCode address={account?.address} />
          </MotionFlex>
        )}
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  contentWrapper: cssObj({
    height: '100%',
    flexDirection: 'column',
    gap: '$4',
  }),
};
