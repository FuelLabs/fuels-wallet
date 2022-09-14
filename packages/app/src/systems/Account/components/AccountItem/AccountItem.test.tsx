import { render, screen, testA11y } from "@fuel-ui/test-utils";

import { AccountItem } from "./AccountItem";

const ACCOUNT = {
  name: "Account 1",
  address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
  publicKey: "0x000",
};

describe("AccountItem", () => {
  it("a11y", async () => {
    await testA11y(<AccountItem account={ACCOUNT} />);
  });

  it("should show a name and as abbreviated address", async () => {
    render(<AccountItem account={ACCOUNT} />);
    expect(screen.getByText("Account 1")).toBeInTheDocument();
    expect(screen.getByText("fuel0x...74ef")).toBeInTheDocument();
  });

  it("should return null when isHidden", async () => {
    render(<AccountItem account={ACCOUNT} isHidden />);
    expect(() => screen.getByText("Account 1")).toThrow();
    expect(() => screen.getByText("fuel0x...74ef")).toThrow();
  });
});
