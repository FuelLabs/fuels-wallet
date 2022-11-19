import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

import { useDocContext } from '~/hooks/useDocContext';

export function Sidebar() {
  const { links } = useDocContext();
  return (
    <Box css={styles.root}>
      <Box as="nav" css={{ position: 'sticky', top: 0 }}>
        {links.map((link) => {
          return link.slug ? (
            <SidebarLink key={link.slug} item={link} />
          ) : (
            <SidebarSubmenu key={link.subpath} {...link} />
          );
        })}
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    position: 'sticky',
    top: 20,

    nav: {
      pl: '$6',
      py: '$8',
      display: 'flex',
      flexDirection: 'column',
      gap: '$1',
    },
  }),
};
