import { Drawer, Icon, IconButton } from '@fuel-ui/react';

import { useLayoutContext } from './Layout';

import { Sidebar } from '~/systems/Sidebar';

export function SideBar() {
  const { ref } = useLayoutContext();
  return (
    <Drawer type="menu" size={220} containerRef={ref}>
      <Drawer.Trigger>
        <IconButton
          icon={<Icon icon="List" color="gray8" size={24} />}
          aria-label="Menu"
          variant="link"
          css={{ px: '0 !important' }}
        />
      </Drawer.Trigger>
      <Drawer.Content
        transition={{
          duration: 0.3,
        }}
      >
        <Sidebar />
      </Drawer.Content>
    </Drawer>
  );
}
