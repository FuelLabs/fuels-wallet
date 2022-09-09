import { ThemeProvider } from "@fuel-ui/react";
import type { ReactNode } from "react";

import { GlobalStateProvider } from "./GlobalState";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <GlobalStateProvider>{children}</GlobalStateProvider>
    </ThemeProvider>
  );
}
