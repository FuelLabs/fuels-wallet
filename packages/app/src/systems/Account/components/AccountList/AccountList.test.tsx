import { render, screen, testA11y } from "@fuel-ui/test-utils";

import { AccountList } from "./AccountList";

const ACCOUNTS = [
  {
    name: "Account 1",
    address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
    publicKey: "0x000",
  },
  {
    name: "Account 2",
    address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d20934734r",
    publicKey: "0x000",
  },
  {
    name: "Account 3",
    address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d209347123",
    isHidden: true,
    publicKey: "0x000",
  },
];

describe("AccountList", () => {
  it("a11y", async () => {
    await testA11y(<AccountList accounts={ACCOUNTS} />);
  });

  it("should render two accounts", () => {
    render(<AccountList accounts={ACCOUNTS} />);
    expect(screen.getByText("Account 1")).toBeInTheDocument();
    expect(screen.getByText("Account 2")).toBeInTheDocument();
    expect(() => screen.getByText("Account 3")).toThrow();
  });

  it("should show hidden accounts when click on toggle button", async () => {
    const { user } = render(<AccountList accounts={ACCOUNTS} />);
    const btn = screen.getByText(/show hidden/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(screen.getByText("Account 3")).toBeInTheDocument();
  });
});
