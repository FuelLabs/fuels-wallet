/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heading as FuelHeading } from '@fuel-ui/react';

export function Heading({ children, ...props }: any) {
  return (
    <FuelHeading as={props['data-rank']} {...props}>
      {children}
    </FuelHeading>
  );
}
