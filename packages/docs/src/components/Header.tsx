import { cssObj } from '@fuel-ui/css';
import { Flex, FuelLogo, Text } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Search } from './Search';

export function Header() {
  const { asPath } = useRouter();
  const isDocsActive = asPath === '/' || asPath.startsWith('/docs');
  const isExamplesActive = asPath.startsWith('/examples');
  return (
    <Flex as="header" css={styles.root}>
      <FuelLogo size={40} />
      <Text as="span" css={styles.logoText}>
        Fuel Wallet SDK
      </Text>
      <Flex css={styles.menu}>
        <Link href="/" className={isDocsActive ? 'active' : ''}>
          Docs
        </Link>
        <Link href="/examples" className={isExamplesActive ? 'active' : ''}>
          Examples
        </Link>
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
    flex: 1,
    fontSize: '$lg',
    fontWeight: '$semibold',
  }),
  menu: cssObj({
    gap: '$6',
    a: {
      color: '$gray12',
      transition: 'all 0.3s',
    },
    'a.active, a:hover': {
      color: '$accent11',
    },
  }),
};
