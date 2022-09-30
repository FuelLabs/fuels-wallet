import { BoxCentered, Button, Link } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { Layout, Pages, relativeUrl } from '~/systems/Core';

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <Layout title="Fuel Wallet" isPublic>
      <BoxCentered minHS minWS gap="$2" direction="column">
        <Button onPress={() => navigate(Pages.home())}>Go to Wallet</Button>
        <Link download={true} href={relativeUrl('fuel-wallet.zip')}>
          Download Wallet
        </Link>
        <Button
          variant="link"
          onPress={() => {
            window.location.href = import.meta.env.VITE_STORYBOOK_URL;
          }}
        >
          Check our Storybook
        </Button>
      </BoxCentered>
    </Layout>
  );
}
