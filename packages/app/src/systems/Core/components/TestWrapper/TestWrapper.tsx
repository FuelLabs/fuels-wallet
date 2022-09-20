import type { ReactNode } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location?.pathname}</div>;
};

export function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      {children}
      <LocationDisplay />
    </BrowserRouter>
  );
}
