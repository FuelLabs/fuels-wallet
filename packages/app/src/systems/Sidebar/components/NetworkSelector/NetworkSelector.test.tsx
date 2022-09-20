import { render, screen, testA11y } from "@fuel-ui/test-utils";
import { BrowserRouter } from "react-router-dom";

import { NetworkSelector } from "./NetworkSelector";

const NETWORKS = [
  {
    id: 1,
    isSelected: true,
    isOnline: true,
    name: "Mainnet",
    url: "https://node.fuel.network/graphql",
  },
  {
    id: 2,
    name: "Localhost",
    url: "http://localhost:4000",
  },
];

describe("NetworkSelector", () => {
  it("a11y", async () => {
    await testA11y(<NetworkSelector networks={NETWORKS} />, {
      wrapper: BrowserRouter,
    });
  });

  it("should open dropdown with given networks", async () => {
    const { user } = render(<NetworkSelector networks={NETWORKS} />, {
      wrapper: BrowserRouter,
    });
    expect(() => screen.getByText("Localhost")).toThrow();
    const selector = screen.getByTestId("fuel_network-item");
    await user.click(selector);
    expect(screen.getByText("Localhost")).toBeInTheDocument();
  });

  it("should dispatch onSelectNetwork handle", async () => {
    const handler = jest.fn();
    const { user } = render(
      <NetworkSelector networks={NETWORKS} onSelectNetwork={handler} />,
      { wrapper: BrowserRouter }
    );

    const selector = screen.getByTestId("fuel_network-item");
    await user.click(selector);
    const item = screen.getByText("Localhost");
    expect(item).toBeInTheDocument();
    await user.click(item);
    expect(handler).toBeCalledWith(NETWORKS[1]);
  });
});
