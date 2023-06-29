import type { LinkProps } from '@fuel-ui/react';
import { Link as FuelLink } from '@fuel-ui/react';

import { REPO_LINK } from '../constants';

export function Link(props: LinkProps) {
  const { href } = props;
  const finalHref = href?.replace('@repository', REPO_LINK);
  return (
    <FuelLink
      {...props}
      href={finalHref}
      isExternal
      css={{ color: '$brand' }}
    />
  );
}
