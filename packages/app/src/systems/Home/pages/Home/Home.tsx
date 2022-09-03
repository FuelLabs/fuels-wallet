import { Flex } from "@fuel-ui/react";

import { useHome } from "../../hooks/useHome";
import { AssetsTitle } from "../components/AssetsTitle/AssetsTitle";
import { HomeActions } from "../components/HomeActions/HomeActions";

import { BalanceWidget } from "~/systems/Account/components/BalanceWidget/BalanceWidget";
import { AssetList } from "~/systems/Asset";
import { Layout } from "~/systems/Core";

export function Home() {
  const { state, context } = useHome();

  const balances = [...(context.account?.balances || [])];

  return (
    <Layout title="Home" isLoading={state.hasTag("loading")}>
      <Layout.TopBar />
      <Layout.Content>
        <Flex direction="column" css={{ height: "100%" }}>
          {state.hasTag("loadingAccount") || !context.account ? (
            <BalanceWidget.Loader />
          ) : (
            <BalanceWidget account={context.account} />
          )}
          <HomeActions isDisabled={state.hasTag("loading")} />
          <AssetsTitle />
          {state.hasTag("loading") && <AssetList.Loading items={4} />}
          {Boolean(!state.hasTag("loading") && balances.length) && (
            <AssetList assets={balances} />
          )}
          {Boolean(!state.hasTag("loading") && !balances.length) && (
            <Flex css={{ flex: "1 0" }}>
              <AssetList.Empty />
            </Flex>
          )}
        </Flex>
      </Layout.Content>
    </Layout>
  );
}
