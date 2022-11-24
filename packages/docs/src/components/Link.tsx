import type { LinkProps } from '@fuel-ui/react';
import { Link as FuelLink } from '@fuel-ui/react';

export function Link(props: LinkProps) {
  return <FuelLink {...props} isExternal />;
}
