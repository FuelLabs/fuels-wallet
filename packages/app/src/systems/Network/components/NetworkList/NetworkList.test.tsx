import { render, screen, testA11y } from "@fuel-ui/test-utils";
import { BrowserRouter } from "react-router-dom";

import { NetworkList } from "./NetworkList";

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

describe("NetworkList", () => {
  it("a11y", async () => {
    await testA11y(<NetworkList networks={NETWORKS} />, {
      wrapper: BrowserRouter,
    });
  });

  it("should render a list of networks", () => {
    render(<NetworkList networks={NETWORKS} />, { wrapper: BrowserRouter });
    expect(screen.getByText("Mainnet")).toBeInTheDocument();
    expect(screen.getByText("Localhost")).toBeInTheDocument();
  });
});
