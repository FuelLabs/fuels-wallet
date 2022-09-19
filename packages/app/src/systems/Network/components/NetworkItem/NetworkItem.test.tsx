import { CardList } from "@fuel-ui/react";
import { render, screen, testA11y, waitFor } from "@fuel-ui/test-utils";
import { BrowserRouter } from "react-router-dom";

import type { NetworkItemProps } from "./NetworkItem";
import { NetworkItem } from "./NetworkItem";

const NETWORK = {
  id: 1,
  isSelected: true,
  isOnline: true,
  name: "Mainnet",
  url: "https://node.fuel.network/graphql",
};

const Content = (props: Partial<NetworkItemProps>) => {
  return (
    <CardList>
      <NetworkItem network={NETWORK} {...props} />
    </CardList>
  );
};

describe("NetworkItem", () => {
  it("a11y", async () => {
    await testA11y(<Content />, { wrapper: BrowserRouter });
  });

  it("should render item correctly", async () => {
    render(<Content />, { wrapper: BrowserRouter });
    expect(screen.getByText("Mainnet")).toBeInTheDocument();
  });

  it("should render actions when has showActions prop", async () => {
    render(<Content showActions />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText("Edit")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove")).toBeInTheDocument();
  });

  it("should show a confirm dialog before remove", async () => {
    const removeHandler = jest.fn();
    const { user } = render(<Content showActions onRemove={removeHandler} />, {
      wrapper: BrowserRouter,
    });

    const removeBtn = screen.getByLabelText("Remove");
    await user.click(removeBtn);

    expect(
      await screen.findByText("Are you absolutely sure?")
    ).toBeInTheDocument();

    const confirmBtn = screen.getByText("Confirm");
    await user.click(confirmBtn);

    expect(removeHandler).toBeCalledTimes(1);
    await waitFor(async () => {
      expect(() => screen.getByText("Are you absolutely sure?")).toThrow();
    });
  });
});
