import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IS_PUBLIC_PREVIEW } from '../constants';

import { EnvironmentDropdown } from '../components/EnvironmentDropdown';
import { useExtensionTitle } from '../hooks/useExtensionTitle';
import { MobileMenu } from './MobileMenu';
import { Search } from './Search';

export function Header() {
  const title = useExtensionTitle();

  const pathname = usePathname();
  const isDocsActive = pathname?.startsWith('/docs');

  return (
    <Box.Flex as="header" css={styles.root}>
      <Box.Flex css={{ alignItems: 'center', flex: 1 }}>
        <Link href="/" className="logo">
          <FuelLogo size={40} />
          <Box.Flex css={styles.logoText}>
            <span>{title}</span>
            <Box as="span" css={styles.version}>
              beta
            </Box>
          </Box.Flex>
        </Link>
        <EnvironmentDropdown />
      </Box.Flex>
      <Box css={styles.desktop}>
        <Box.Flex css={styles.menu}>
          <Link href="/docs/install" className={isDocsActive ? 'active' : ''}>
            Docs
          </Link>
          {IS_PUBLIC_PREVIEW && (
            <a
              href={process.env.NEXT_PUBLIC_STORYBOOK_URL}
              target="_blank"
              rel="noreferrer"
            >
              Storybook
            </a>
          )}
          <a
            href="https://github.com/fuellabs/fuels-wallet"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('BrandGithubFilled')} size={24} />
          </a>
        </Box.Flex>
        <Search />
      </Box>
      <MobileMenu />
    </Box.Flex>
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
    borderBottom: '1px solid $intentsBase2',
    gridColumn: '1 / 4',

    '.logo': {
      display: 'inline-flex',
      color: '$intentsBase9',
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
    pl: '$6',
    alignItems: 'center',
    flex: 1,
    fontSize: '$2xl',
    fontWeight: '$normal',
    color: 'white',
    letterSpacing: '-0.05em',
  }),
  version: cssObj({
    ml: '$2',
    color: '$intentsBase8',
    fontSize: '$sm',
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
    '.fuel_Button': {
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
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$intentsPrimary11',
    },
  }),
};
