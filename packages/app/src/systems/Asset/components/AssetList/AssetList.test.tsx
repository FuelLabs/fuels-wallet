import { render, screen, testA11y } from "@fuel-ui/test-utils";
import { toBigInt } from "fuels";
import { BrowserRouter } from "react-router-dom";

import { ASSET_LIST } from "../../utils";

import { AssetList } from "./AssetList";

const ASSETS = ASSET_LIST.map(({ assetId }) => ({
  assetId,
  amount: toBigInt(1000000000),
}));

describe("AssetList", () => {
  it("a11y", async () => {
    await testA11y(<AssetList assets={ASSETS} />);
  });

  it("should show tree assets", () => {
    render(<AssetList assets={ASSETS} />);
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("Dai")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  });

  it("should show an empty illustration when no assets", () => {
    render(<AssetList.Empty />, { wrapper: BrowserRouter });
    expect(screen.getByText("You don't have any assets")).toBeInTheDocument();
    expect(screen.getByAltText("No assets")).toBeInTheDocument();
  });
});
