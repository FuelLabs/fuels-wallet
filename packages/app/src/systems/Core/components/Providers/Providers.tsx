import { ThemeProvider } from "@fuel-ui/react";
import type { ReactNode } from "react";

import { AccountProvider } from "~/systems/Account";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AccountProvider>{children}</AccountProvider>
    </ThemeProvider>
  );
}
