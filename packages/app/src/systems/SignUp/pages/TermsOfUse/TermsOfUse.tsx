import { cssObj } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';

import { Header, Stepper } from '../../components';
import { useSignUp, useSignUpStepper } from '../../hooks';

import { ReactComponent as Terms } from './data/terms.md';

import { Layout } from '~/systems/Core';

export function TermsOfUse() {
  const { handlers } = useSignUp();
  const { steps } = useSignUpStepper();

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
          <Button variant="ghost" onPress={handlers.reset}>
            Back
          </Button>
          <Button intent="primary" onPress={handlers.next}>
            Next: Seed Phrase
          </Button>
        </Box.Flex>
      </Box.Stack>
    </Layout>
  );
}

const SIGNUP_HEIGHT = 350;

const styles = {
  termsWrapper: {
    layer: 'layer-card',
    overflowY: 'scroll',
    pr: '$2',
    px: '$5',
    boxSizing: 'border-box',
    height: SIGNUP_HEIGHT,

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
    height: SIGNUP_HEIGHT,
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
