import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FuelBrandingDropdown } from '../components/FuelBrandingDropdown';
import { IS_PUBLIC_PREVIEW } from '../constants';
import { MobileMenu } from './MobileMenu';
import { Search } from './Search';

export function Header() {
  const pathname = usePathname();
  const isDocsActive = pathname?.startsWith('/docs');

  return (
    <Box.Flex as="header" css={styles.root}>
      <Box.Flex css={{ alignItems: 'center', flex: 1 }}>
        <FuelBrandingDropdown />
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
