import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Icon, IconButton, Link } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import { useEffect, useState } from 'react';

import { IS_PUBLIC_PREVIEW } from '../constants';

import { Search } from './Search';
import { Sidebar } from './Sidebar';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const MotionBox = motion<any>(Box);
const SPRING: AnimationProps['transition'] = {
  ease: 'linear',
  duration: '0.1',
};

export function MobileMenu() {
  const [showing, setShowing] = useState(false);

  function toggle() {
    setShowing((s) => !s);
  }

  useEffect(() => {
    if (showing) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [showing]);

  const button = (
    <IconButton
      className="mobile-button"
      variant="link"
      icon={showing ? Icon.is('X') : Icon.is('Menu2')}
      iconSize={30}
      aria-label="Menu"
      onPress={toggle}
    />
  );

  const content = (
    <MotionBox
      css={styles.content}
      animate={{ x: 0 }}
      initial={{ x: '100%' }}
      exit={{ x: '100%' }}
      transition={SPRING}
    >
      <Box.Flex css={styles.menu}>
        <Box.Flex css={styles.nav}>
          <FuelLogo size={30} />
          <Link href="/docs/install">Docs</Link>
          {IS_PUBLIC_PREVIEW && (
            <>
              <a
                href={process.env.NEXT_PUBLIC_STORYBOOK_URL}
                target="_blank"
                rel="noreferrer"
              >
                Storybook
              </a>
              <a href={process.env.NEXT_PUBLIC_APP_URL}>Open Wallet</a>
            </>
          )}
          <a
            href="https://github.com/fuellabs/fuels-wallet"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('BrandGithubFilled')} size={24} />
          </a>
        </Box.Flex>
        {button}
      </Box.Flex>
      <Sidebar />
    </MotionBox>
  );

  return (
    <Box css={styles.root}>
      <Search />
      {button}
      <AnimatePresence>
        {showing && <Box css={styles.overlay}>{content}</Box>}
      </AnimatePresence>
    </Box>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$4',

    '.mobile-button': {
      height: 'auto !important',
      padding: '$0 !important',
      color: '$intentsBase8 !important',
    },

    '@xl': {
      display: 'none',
    },
  }),
  menu: cssObj({
    pb: '$4',
    mb: '$4',
    borderBottom: '1px solid $intentsBase3',
    gap: '$6',
    alignItems: 'center',
    justifyContent: 'space-between',

    a: {
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$intentsPrimary11',
    },
  }),
  nav: cssObj({
    gap: '$4',
    alignItems: 'center',
    flex: 1,
  }),
  overlay: cssObj({
    display: 'flex',
    flexDirection: 'row-reverse',
    zIndex: '$10',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,.8)',
    overflow: 'hidden',
    boxSizing: 'border-box',
  }),
  content: cssObj({
    boxSizing: 'border-box',
    padding: '$4',
    width: '100vw',
    height: '100%',
    background: '$bodyColor',

    '@sm': {
      width: '400px',
    },
  }),
};
