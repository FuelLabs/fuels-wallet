import { Button, Flex, FuelLogo, Stack } from '@fuel-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from '../../components';

import { Layout, Pages } from '~/systems/Core';
import { useIsSigningUp } from '~/systems/Core/hooks/useIsSigningUp';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const isSigningUp = useIsSigningUp();

  useEffect(() => {
    if (isSigningUp) {
      navigate(Pages.signUpCreateWallet());
    }
  }, [isSigningUp]);

  return (
    <Layout title="Sign Up" isPublic>
      <Stack gap="$6" align="center">
        <FuelLogo size={130} css={{ transform: 'translateY(10px)' }} />
        <Header title="Create a new Fuel Wallet" />
        <Flex direction="column" gap="$2">
          <Button
            color="accent"
            onPress={() => navigate(Pages.signUpCreateWallet())}
          >
            Create a Wallet
          </Button>
          <Button
            color="gray"
            variant="ghost"
            onPress={() => navigate(Pages.signUpRecoverWallet())}
          >
            I already have a wallet
          </Button>
        </Flex>
      </Stack>
    </Layout>
  );
}
