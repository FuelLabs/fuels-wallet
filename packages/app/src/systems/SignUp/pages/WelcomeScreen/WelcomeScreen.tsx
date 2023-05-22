import { Box, Button, FuelLogo } from '@fuel-ui/react';
import { Link } from 'react-router-dom';

import { Header } from '../../components';

import { Layout, Pages } from '~/systems/Core';

export function WelcomeScreen() {
  return (
    <Layout title="Sign Up" isPublic>
      <Box.Stack gap="$6" align="center">
        <FuelLogo
          size={120}
          css={{ mb: '$2', transform: 'translateY(10px)' }}
        />
        <Header title="Create a new Fuel Wallet" />
        <Box.Flex direction="column" gap="$2">
          <Button
            as={Link}
            intent="primary"
            to={Pages.signUpTerms({ action: 'create' })}
          >
            Create a Wallet
          </Button>
          <Button
            as={Link}
            variant="ghost"
            to={Pages.signUpTerms({ action: 'recover' })}
          >
            I already have a wallet
          </Button>
        </Box.Flex>
      </Box.Stack>
    </Layout>
  );
}
