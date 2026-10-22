import { cssObj, Box, Card, FuelLogo, Heading, Icon } from '@fuel-wallet/ui';
import type { CSSProperties } from 'react';
import { Layout, MotionStack, animations } from '~/systems/Core';

import { Header } from '../../components';
import { useSignUp } from '../../hooks';

export function WelcomeScreen() {
  const { handlers } = useSignUp();
  return (
    <Layout title="Sign Up" isPublic isCentered>
      <MotionStack gap="$6" css={styles.wrapper} {...animations.fadeIn()}>
        <Box css={styles.logo}>
          <FuelLogo size={50} />
        </Box>
        <Header
          title="Let's set up your Fuel Wallet"
          subtitle="Pick an option below to get started"
        />
        <Box css={styles.footer}>
          <Card onClick={handlers.goToCreate} className="fuel-rise">
            <Box.Centered className="icon icon-primary">
              <Icon icon="Wallet" stroke={1} size={40} />
            </Box.Centered>
            <Box.Stack className="text">
              <Heading as="h3">Create new wallet</Heading>
              <Heading as="h4">
                Create a fresh wallet and generate a new seed phrase.
              </Heading>
            </Box.Stack>
            <Box.Centered
              as="button"
              type="button"
              className="icon arrow"
              aria-label="Create new wallet"
            >
              <Icon icon="ArrowRight" stroke={1.5} size={24} />
            </Box.Centered>
          </Card>
          <Card
            onClick={handlers.goToRecover}
            className="fuel-rise"
            style={{ '--fuel-enter-delay': '80ms' } as CSSProperties}
          >
            <Box.Centered className="icon icon-primary">
              <Icon icon="SquareKey" stroke={1} size={40} />
            </Box.Centered>
            <Box.Stack className="text">
              <Heading as="h3">Import seed phrase</Heading>
              <Heading as="h4">
                Restore an existing wallet using your seed phrase.
              </Heading>
            </Box.Stack>
            <Box.Centered
              as="button"
              type="button"
              className="icon arrow"
              aria-label="Import seed phrase"
            >
              <Icon icon="ArrowRight" stroke={1.5} size={24} />
            </Box.Centered>
          </Card>
        </Box>
      </MotionStack>
    </Layout>
  );
}

const styles = {
  logo: cssObj({
    width: '$full',
    textAlign: 'left',
    fontSize: 0,
    lineHeight: 0,
  }),
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
      border: 'none',
      bg: '$cardBg',
      cursor: 'pointer',
      transition: 'background-color 300ms, box-shadow 300ms',

      '@media (hover: hover)': {
        '&:hover': {
          bg: '$muted',
          boxShadow: 'inset 0 0 0 1px var(--fuel-element-low-em)',
        },
        '&:hover .arrow': {
          color: '$textHigh',
          transform: 'translateX(4px)',
        },
      },
      '&:has(.arrow:focus-visible)': {
        outline: '2px solid $focus',
        outlineOffset: '2px',
      },
    },

    '.arrow': {
      all: 'unset',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: '$textLow',
      transition: 'color 200ms, transform 300ms var(--fuel-ease-out)',
      '@media (prefers-reduced-motion: reduce)': { transition: 'color 200ms' },
    },

    '.icon': {
      py: '$4',
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
      color: '$textLow',
    },
  }),
};
