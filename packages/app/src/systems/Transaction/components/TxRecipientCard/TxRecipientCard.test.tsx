import { render, screen, testA11y } from "@fuel-ui/test-utils";

import { TxRecipientCard } from "./TxRecipientCard";

const ACCOUNT = {
  name: "Account 1",
  address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
  publicKey: "0x00",
};

const CONTRACT = {
  address: "0x239ce1fb790d5b829fe7a40a3d54cb825a403bb3",
};

describe("TxRecipientCard", () => {
  it("a11y", async () => {
    await testA11y(<TxRecipientCard account={ACCOUNT} />);
  });

  it("should render account correctly", () => {
    render(<TxRecipientCard account={ACCOUNT} />);
    expect(screen.getByLabelText("Account 1")).toBeInTheDocument();
    expect(screen.getByText("fuel0x...74ef")).toBeInTheDocument();
  });

  it("should render contract correctly", () => {
    render(<TxRecipientCard contract={CONTRACT} />);
    expect(screen.getByText(/Contract/)).toBeInTheDocument();
    expect(screen.getByText("0x239c...3bb3")).toBeInTheDocument();
  });
});
