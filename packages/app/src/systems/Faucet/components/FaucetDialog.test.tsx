import { render, screen } from "@fuel-ui/test-utils";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { FaucetDialog } from "./FaucetDialog";

import { GlobalMachinesProvider } from "~/systems/Core";

const DialogProvider = ({ children }: { children: ReactNode }) => (
  <>
    <BrowserRouter>
      <GlobalMachinesProvider>{children}</GlobalMachinesProvider>
    </BrowserRouter>
  </>
);

describe("FaucetDialog", () => {
  it("should show Faucet button", async () => {
    render(<FaucetDialog />, { wrapper: DialogProvider });

    const faucetBtn = screen.getByText(/Give me ETH/i);
    expect(faucetBtn).toBeInTheDocument();
  });
});
