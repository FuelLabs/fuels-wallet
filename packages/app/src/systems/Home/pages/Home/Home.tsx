import { Flex } from "@fuel-ui/react";
import { useEffect } from "react";

import { AssetsTitle, HomeActions } from "../../components";

import { BalanceWidget, useAccounts } from "~/systems/Account";
import { AssetList } from "~/systems/Asset";
import { Layout } from "~/systems/Core";

export function Home() {
  const { isLoading, currentAccount, handlers } = useAccounts();

  useEffect(() => {
    handlers.refetch();
  }, []);

  return (
    <Layout title="Home" isLoading={isLoading}>
      <Layout.TopBar />
      <Layout.Content>
        <Flex css={{ height: "100%", flexDirection: "column" }}>
          {isLoading || !currentAccount ? (
            <BalanceWidget.Loader />
          ) : (
            <BalanceWidget account={currentAccount} />
          )}
          <HomeActions isDisabled={isLoading} />
          <AssetsTitle />
          {isLoading && <AssetList.Loading items={4} />}
          {Boolean(!isLoading && currentAccount?.balances?.length) && (
            <AssetList assets={currentAccount?.balances || []} />
          )}
          {Boolean(!isLoading && !currentAccount?.balances?.length) && (
            <Flex css={{ flex: "1 0" }}>
              <AssetList.Empty />
            </Flex>
          )}
        </Flex>
      </Layout.Content>
    </Layout>
  );
}
