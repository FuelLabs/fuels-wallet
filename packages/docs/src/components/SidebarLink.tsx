/* eslint-disable @typescript-eslint/no-explicit-any */
import { cx, styled } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';

import type { SidebarLinkItem } from '../types';

const Link = styled(Box, {
  py: '$1',
  px: '$2',
  color: '$gray10',
  borderRadius: '$md',
  '&:focus, &:hover': {
    color: '$gray11',
    background: '$whiteA3',
  },
  '&.active': {
    color: '$accent11',
    background: '$accent2',
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
    const router = useRouter();
    const fullSlug = `/docs/${item.slug}`;
    const isActive = cx({
      active:
        (router.asPath === '/' && fullSlug === '/docs/install') ||
        router.asPath.includes(fullSlug),
    });
    return (
      <Link ref={ref} as={NextLink as any} href={fullSlug} className={isActive}>
        {item.label}
      </Link>
    );
  }
);
