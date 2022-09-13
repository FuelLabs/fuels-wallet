import { render, screen, testA11y } from "@fuel-ui/test-utils";

import { ASSET_LIST } from "../../utils";

import { AssetItem } from "./AssetItem";

const AMOUNT = "14563943834";

describe("AssetItem", () => {
  it("a11y", async () => {
    await testA11y(<AssetItem asset={ASSET_LIST[0]} amount={AMOUNT} />);
  });

  it("should show asset name", () => {
    render(<AssetItem asset={ASSET_LIST[0]} amount={AMOUNT} />);
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("should show asset symbol", () => {
    render(<AssetItem asset={ASSET_LIST[0]} amount={AMOUNT} />);
    expect(screen.getByText("ETH")).toBeInTheDocument();
  });

  it("should show asset amount formatted", () => {
    render(<AssetItem asset={ASSET_LIST[0]} amount={AMOUNT} />);
    expect(screen.getByText("14,564 ETH")).toBeInTheDocument();
  });
});
