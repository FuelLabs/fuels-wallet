import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import type { SidebarLinkItem } from '../types';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

const MENU: SidebarLinkItem[] = [
  { slug: '/', label: 'Home' },
  { slug: '/docs/install', label: 'Install' },
  { slug: '/docs/how-to-use', label: 'How to use' },
  {
    subpath: '/docs/contributing',
    label: 'Contributing',
    submenu: [
      {
        slug: '/docs/contributing/project-structure',
        label: 'Project Structure',
      },
      {
        slug: '/docs/contributing/guide',
        label: 'Contributing Guide',
      },
    ],
  },
];

export function Sidebar() {
  return (
    <Box as="nav" css={styles.root}>
      {MENU.map((doc, idx) => {
        return doc.slug ? (
          <SidebarLink key={doc.slug} item={doc} />
        ) : (
          <SidebarSubmenu key={idx} {...doc} />
        );
      })}
    </Box>
  );
}

const styles = {
  root: cssObj({
    a: {
      color: '$gray8',
    },
    'a.active, a:hover': {
      color: '$accent11',
    },
  }),
};
