import { Box, Button, Flex, Stack } from '@fuel-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import { Header } from '../../components';

import { ReactComponent as Terms } from './data/terms.md';

import { Layout, Pages } from '~/systems/Core';
import { useHasAcceptedTerms } from '~/systems/Core/hooks/useAcceptedTerms';

export function TermsOfUse() {
  const navigate = useNavigate();
  const { action } = useParams();
  const { setHasAcceptedTerms } = useHasAcceptedTerms();

  const handleAccept = () => {
    setHasAcceptedTerms(true);
    if (action === 'recover') {
      navigate(Pages.signUpRecoverWallet());
    }
    navigate(Pages.signUpCreateWallet());
  };

  const handleCancel = () => {
    setHasAcceptedTerms(false);
    navigate(Pages.signUpWelcome());
  };

  return (
    <Layout title="Terms of Service" isPublic>
      <Stack gap="$8" align="center">
        <Header
          title="Terms of Service"
          subtitle="Read and accept our terms of service"
        />
        <Box css={styles.termsContainer}>
          <Flex css={styles.termsWrapper}>
            <Terms />
          </Flex>
        </Box>
        <Flex gap="$2">
          <Button color="gray" variant="ghost" onPress={handleCancel}>
            Cancel
          </Button>
          <Button color="accent" onPress={handleAccept}>
            I accept
          </Button>
        </Flex>
      </Stack>
    </Layout>
  );
}

const styles = {
  termsWrapper: {
    overflowY: 'scroll',
    padding: '$4',
    backgroundColor: '$gray3',
    boxSizing: 'border-box',
    height: '480px',

    '&::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: '$gray3',
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$gray5',
      borderRadius: '40px',
    },

    '& h1, & h2': {
      lineHeight: '1.5',
    },
  },
  termsContainer: {
    height: '480px',
    overflow: 'hidden',
    maxWidth: '700px',
    borderRadius: '8px',
  },
};
