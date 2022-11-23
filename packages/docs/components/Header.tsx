import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, FuelLogo, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MobileMenu } from './MobileMenu';
import { Search } from './Search';

export function Header() {
  const pathname = usePathname();
  const isDocsActive = pathname?.startsWith('/docs');

  return (
    <Flex as="header" css={styles.root}>
      <Box css={{ flex: 1 }}>
        <Link href="/" className="logo">
          <FuelLogo size={40} />
          <Flex css={styles.logoText}>
            <span>Fuel Wallet</span>
            <Box as="span" css={styles.version}>
              alpha
            </Box>
          </Flex>
        </Link>
      </Box>
      <Box css={styles.desktop}>
        <Flex css={styles.menu}>
          <Link href="/docs/install" className={isDocsActive ? 'active' : ''}>
            Docs
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_STORYBOOK_URL}
            target="_blank"
            rel="noreferrer"
          >
            Storybook
          </a>
          <a
            href="https://github.com/fuellabs/fuels-wallet"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('GithubLogo')} size={24} />
          </a>
        </Flex>
        <Search />
        <Button
          as="a"
          css={{ ml: '$8' }}
          href={process.env.NEXT_PUBLIC_APP_URL}
        >
          Open Wallet
        </Button>
      </Box>
      <MobileMenu />
    </Flex>
  );
}

const styles = {
  root: cssObj({
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    background: '#090a0a',
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
    borderBottom: '1px solid $gray2',
    gridColumn: '1 / 4',

    '.logo': {
      display: 'flex',
      color: '$gray9',
    },

    '@md': {
      px: '$8',
    },

    '@xl': {
      position: 'relative',
      py: '$4',
      px: '$8',
    },
  }),
  logoText: cssObj({
    alignItems: 'center',
    flex: 1,
    fontSize: '$lg',
    fontWeight: '$semibold',
  }),
  version: cssObj({
    ml: '$2',
    color: '$gray8',
    fontSize: '$xs',
    fontStyle: 'italic',
  }),
  desktop: cssObj({
    display: 'none',

    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  mobile: cssObj({
    display: 'flex',
    alignItems: 'center',
    '.fuel_button': {
      height: 'auto !important',
      padding: '$0 !important',
    },

    '@xl': {
      display: 'none',
    },
  }),
  menu: cssObj({
    gap: '$6',

    a: {
      color: '$gray10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$accent11',
    },
  }),
};
