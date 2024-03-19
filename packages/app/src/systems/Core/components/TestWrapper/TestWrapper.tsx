import type { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom';

import { Providers } from '../Providers';

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location?.pathname}</div>;
};

export type TestWrapperProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
  return <BrowserRouter>{content}</BrowserRouter>;
}
