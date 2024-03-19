import { cx, styled } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

const Link = styled(Box, {
  py: '$1',
  px: '$2',
  color: '$intentsBase10',
  borderRadius: '$md',
  '&:focus, &:hover': {
    color: '$intentsBase11',
    background: '$whiteA3',
  },
  '&.active': {
    color: '$intentsPrimary11',
    background: '$intentsPrimary2',
  },
  '&:focus': {
    outline: 'none',
  },
});

export type SidebarLinkProps = {
  item: SidebarLinkItem;
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item }, ref) => {
    const pathname = usePathname() || '';
    const fullSlug = `/docs/${item.slug}`;
    const isActive = cx({
      active:
        (pathname === '/' && fullSlug === '/docs/install') ||
        pathname.includes(fullSlug),
    });
    return (
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      <Link ref={ref} as={NextLink as any} href={fullSlug} className={isActive}>
        {item.label}
      </Link>
    );
  }
);
