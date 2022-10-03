/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom';

import { Providers } from '../Providers';

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location?.pathname}</div>;
};

type TestWrapperProps = {
  initialEntries?: any[];
  children?: ReactNode;
};

export function TestWrapper({ children, initialEntries }: TestWrapperProps) {
  const content = (
    <>
      <Providers>{children}</Providers>
      <LocationDisplay />
    </>
  );
  if (initialEntries) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>
    );
  }
  return (
    <BrowserRouter>
      <Providers>{children}</Providers>
      <LocationDisplay />
    </BrowserRouter>
  );
}
