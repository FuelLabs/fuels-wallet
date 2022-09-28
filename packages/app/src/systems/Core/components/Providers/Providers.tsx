import { ThemeProvider } from "@fuel-ui/react";
import type { ReactNode } from "react";

import { GlobalMachinesProvider } from "~/systems/Global";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <GlobalMachinesProvider>{children}</GlobalMachinesProvider>
    </ThemeProvider>
  );
}
