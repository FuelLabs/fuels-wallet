import { cx } from '@fuel-ui/css';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { SidebarLinkItem } from '../types';

export type SidebarLinkProps = {
  item: SidebarLinkItem;
};
export function SidebarLink({ item }: SidebarLinkProps) {
  const router = useRouter();
  const fullSlug = `/docs/${item.slug}`;
  const isActive = cx({ active: router.asPath === fullSlug });
  return (
    <Link href={item.slug!} className={isActive}>
      {item.label}
    </Link>
  );
}
