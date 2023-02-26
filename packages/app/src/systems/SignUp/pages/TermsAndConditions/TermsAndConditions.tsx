import { Box, Button, Flex, Stack } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { Header } from '../../components';

import { ReactComponent as Terms } from './data/terms.md';

import { Layout, Pages } from '~/systems/Core';

export function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <Layout title="Terms of Service" isPublic>
      <Stack gap="$8" align="center">
        <Header
          title="Terms of Service"
          subtitle="Read and accept out terms of service"
        />
        <Box css={styles.termsContainer}>
          <Terms />
        </Box>
        <Flex gap="$2">
          <Button
            color="gray"
            variant="ghost"
            onPress={() => navigate(Pages.signUpWelcome())}
          >
            Cancel
          </Button>
          <Button
            color="accent"
            onPress={() => navigate(Pages.signUpCreateWallet())}
          >
            I accept
          </Button>
        </Flex>
      </Stack>
    </Layout>
  );
}

const styles = {
  termsContainer: {
    height: '480px',
    maxWidth: '700px',
    overflowY: 'scroll',
    padding: '$4',
    backgroundColor: '$gray3',
    borderRadius: '8px',
  },
};
