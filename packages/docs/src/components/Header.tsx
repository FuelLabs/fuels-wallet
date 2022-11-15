import { cssObj } from '@fuel-ui/css';
import { Box, Flex, FuelLogo, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Search } from './Search';

export function Header() {
  const { asPath } = useRouter();
  const isHomeActive = asPath === '/';
  const isDocsActive = asPath.startsWith('/docs');
  return (
    <Flex as="header" css={styles.root}>
      <FuelLogo size={40} />
      <Flex css={styles.logoText}>
        <span>Fuel Wallet SDK</span>
        <Box as="span" css={styles.version}>
          alpha
        </Box>
      </Flex>
      <Flex css={styles.menu}>
        <Link href="/" className={isHomeActive ? 'active' : ''}>
          Home
        </Link>
        <Link href="/docs/install" className={isDocsActive ? 'active' : ''}>
          Docs
        </Link>
        <Link href="/storybook">Storybook</Link>
        <a
          href="https://github.com/fuellabs/fuels-wallet"
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon={Icon.is('GithubLogo')} size={24} />
        </a>
      </Flex>
      <Search />
    </Flex>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    alignItems: 'center',
    py: '$4',
    px: '$8',
    borderBottom: '1px solid $gray2',
    gridColumn: '1 / 4',
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
