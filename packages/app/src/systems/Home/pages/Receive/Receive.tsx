import { cssObj } from '@fuel-ui/css';
import { Address } from 'fuels';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '~/systems/Account';
import { Layout, MotionFlex, Pages, animations } from '~/systems/Core';

import { ReceiverQRCode } from '../../components/QRCode';
import { UserAddressCard } from '../../components/UserAddressCard';

export function Receive() {
  const navigate = useNavigate();
  const { account } = useAccounts();
  return (
    <Layout title="Receive">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content css={styles.content}>
        {account?.address && (
          <MotionFlex {...animations.slideInTop()} css={styles.contentWrapper}>
            <UserAddressCard
              address={Address.fromDynamicInput(account?.address).toChecksum()}
            />
            <ReceiverQRCode
              address={Address.fromDynamicInput(account?.address).toChecksum()}
            />
          </MotionFlex>
        )}
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    mt: '$4',
  }),
  contentWrapper: cssObj({
    height: '100%',
    flexDirection: 'column',
    gap: '$4',
  }),
};
