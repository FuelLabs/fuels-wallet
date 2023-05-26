import { cssObj } from '@fuel-ui/css';
import { Box, Card, FuelLogo, Heading, Icon } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { Header } from '../../components';

import { Layout, Pages } from '~/systems/Core';

export function WelcomeScreen() {
  const navigate = useNavigate();
  return (
    <Layout title="Sign Up" isPublic>
      <Box.Stack gap="$6" css={styles.wrapper}>
        <FuelLogo
          size={120}
          css={{ mb: '$8', transform: 'translateY(10px)' }}
        />
        <Header
          title="Let's set up your Fuel Wallet"
          subtitle="Pick an option below to get started"
        />
        <Box css={styles.footer}>
          <Card
            onClick={() => navigate(Pages.signUpTerms({ action: 'create' }))}
          >
            <Box.Centered className="icon icon-primary">
              <Icon icon="Wallet" stroke={1} size={40} />
            </Box.Centered>
            <Box.Stack className="text">
              <Heading as="h3">Create new wallet</Heading>
              <Heading as="h4">
                Create a fresh wallet and generate a new seed phrase.
              </Heading>
            </Box.Stack>
            <Box.Centered className="icon">
              <Icon icon="ArrowRight" stroke={1} size={40} />
            </Box.Centered>
          </Card>
          <Card
            onClick={() => navigate(Pages.signUpTerms({ action: 'recover' }))}
          >
            <Box.Centered className="icon icon-primary">
              <Icon icon="SquareKey" stroke={1} size={40} />
            </Box.Centered>
            <Box.Stack className="text">
              <Heading as="h3">Import seed phrase</Heading>
              <Heading as="h4">
                Restore an existing wallet using your seed-phrase.
              </Heading>
            </Box.Stack>
            <Box.Centered className="icon">
              <Icon icon="ArrowRight" stroke={1} size={40} />
            </Box.Centered>
          </Card>
        </Box>
      </Box.Stack>
    </Layout>
  );
}

const styles = {
  wrapper: cssObj({
    is: ['centered'],
  }),
  footer: cssObj({
    width: '$full',
    display: 'grid',
    gap: '$4',

    '.fuel_Card': {
      boxSizing: 'border-box',
      padding: '$0 $6 $1',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      gridColumnGap: '$6',
      border: '1px solid $cardBg',
      bg: '$intentsBase1',

      '&:hover': {
        cursor: 'pointer',
        borderColor: '$border',
      },
    },

    '.icon': {
      py: '$4',
      color: '$intentsBase6',
    },
    '.icon-primary': {
      color: '$brand',
    },
    '.text': {
      py: '$3',
      gap: '$0',
    },
    '.fuel_Heading': {
      fontSize: '$lg',
      margin: '$0',
    },
    '.fuel_Heading:is(h4)': {
      fontSize: '$base',
      lineHeight: '$tight',
      color: '$muted',
    },
  }),
};
