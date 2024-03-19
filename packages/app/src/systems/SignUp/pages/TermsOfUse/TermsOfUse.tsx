import { cssObj } from '@fuel-ui/css';
import { Box, Button, Checkbox, Form } from '@fuel-ui/react';
import { useState } from 'react';
import { Layout, MotionStack, animations } from '~/systems/Core';
import { ReactComponent as Terms } from '~public/TermOfService.md';

import { Header, Stepper } from '../../components';
import { useSignUp, useSignUpStepper } from '../../hooks';

export function TermsOfUse() {
  const [isSavedChecked, setCheckedTerms] = useState(false);
  const { handlers } = useSignUp();
  const { steps } = useSignUpStepper();

  return (
    <Layout title="Terms of Service" isPublic>
      <MotionStack gap="$6" align="center" {...animations.slideInRight()}>
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
        <Form.Control css={styles.agreeContainer}>
          <Checkbox
            id="agreeTerms"
            aria-label="Agree with terms"
            checked={isSavedChecked}
            onCheckedChange={(e) => {
              setCheckedTerms(e as boolean);
            }}
          />
          <Form.Label htmlFor="agreeTerms">
            I Agree to the Terms Of Use Agreement
          </Form.Label>
        </Form.Control>
        <Box.Flex gap="$2" css={styles.footer}>
          <Button variant="ghost" onPress={handlers.reset}>
            Back
          </Button>
          <Button
            intent="primary"
            isDisabled={!isSavedChecked}
            onPress={handlers.next}
          >
            Next: Seed Phrase
          </Button>
        </Box.Flex>
      </MotionStack>
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
      color: '$intentsPrimary11',
    },
  },
  agreeContainer: cssObj({
    width: '$full',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }),
  termsContainer: cssObj({
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
