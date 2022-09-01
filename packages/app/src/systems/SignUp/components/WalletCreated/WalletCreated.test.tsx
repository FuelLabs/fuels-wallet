import { render, screen } from "@fuel-ui/test-utils";
import { BrowserRouter } from "react-router-dom";

import { WalletCreated } from "./WalletCreated";

const ACCOUNT = {
  name: "Account 1",
  address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
};

describe("WalletCreated", () => {
  it("should show account item component", () => {
    render(<WalletCreated account={ACCOUNT} />, { wrapper: BrowserRouter });
    expect(screen.getByText("Account 1")).toBeInTheDocument();
    expect(screen.getByText("fuel0x...74ef")).toBeInTheDocument();
  });
});
