import { cssObj } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import { Header, Stepper } from '../../components';
import { useSignUpStepper } from '../../hooks';

import { ReactComponent as Terms } from './data/terms.md';

import { Layout, Pages } from '~/systems/Core';
import { useHasAcceptedTerms } from '~/systems/Core/hooks/useAcceptedTerms';

export function TermsOfUse() {
  const navigate = useNavigate();
  const { action } = useParams();
  const { setHasAcceptedTerms } = useHasAcceptedTerms();
  const { steps } = useSignUpStepper();

  function handleAccept() {
    setHasAcceptedTerms(true);
    if (action === 'recover') {
      navigate(Pages.signUpRecoverWallet());
    } else {
      navigate(Pages.signUpCreateWallet());
    }
  }

  const handleCancel = () => {
    setHasAcceptedTerms(false);
    navigate(Pages.signUpWelcome());
  };

  return (
    <Layout title="Terms of Service" isPublic>
      <Box.Stack gap="$8" align="center">
        <Stepper steps={steps} active={1} />
        <Header
          title="Terms of use Agreement"
          subtitle="Read and check to accept our terms of service"
        />
        <Box css={styles.termsContainer}>
          <Box.Flex css={styles.termsWrapper}>
            <Terms />
          </Box.Flex>
        </Box>
        <Box.Flex gap="$2" css={styles.footer}>
          <Button variant="ghost" onPress={handleCancel}>
            Back
          </Button>
          <Button intent="primary" onPress={handleAccept}>
            Next: Seed Phrase
          </Button>
        </Box.Flex>
      </Box.Stack>
    </Layout>
  );
}

const HEIGHT = '350px';

const styles = {
  termsWrapper: {
    layer: 'layer-card',
    overflowY: 'scroll',
    pr: '$2',
    px: '$5',
    boxSizing: 'border-box',
    height: HEIGHT,

    '& >div': {
      marginBottom: '$2',
      height: 'fit-content',
    },

    '&::-webkit-scrollbar': {
      width: '$2',
      backgroundColor: '$intentsBase3',
      borderRadius: '$sm',
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$intentsBase5',
      borderRadius: '$sm',
    },

    '& h1, & h2': {
      lineHeight: '1.5',
    },
    '& a': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '$1',
      textDecoration: 'none',
      fontWeight: '$normal',
      color: '$accent11',
    },
  },
  termsContainer: cssObj({
    height: HEIGHT,
    overflow: 'hidden',
    maxWidth: '700px',
    borderRadius: '$8',
  }),
  footer: cssObj({
    width: '$full',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '$4',
  }),
};
