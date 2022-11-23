import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

import { useDocContext } from '~/src/hooks/useDocContext';

export function Sidebar() {
  const { links } = useDocContext();
  return (
    <Box as="nav" css={styles.root}>
      {links.map((link) => {
        return link.slug ? (
          <SidebarLink key={link.slug} item={link} />
        ) : (
          <SidebarSubmenu key={link.subpath} {...link} />
        );
      })}
    </Box>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
  }),
};
