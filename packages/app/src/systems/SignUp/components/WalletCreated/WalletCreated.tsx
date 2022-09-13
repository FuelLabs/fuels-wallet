import { Stack, Image, Button, Flex } from "@fuel-ui/react";
import { useNavigate } from "react-router-dom";

import { Header } from "../Header";

import type { Account } from "~/systems/Account";
import { AccountItem } from "~/systems/Account";
import type { Maybe } from "~/systems/Core";

export type WalletCreatedProps = {
  account?: Maybe<Account>;
};

export function WalletCreated({ account }: WalletCreatedProps) {
  const navigate = useNavigate();
  return (
    <Stack gap="$6">
      <Flex justify="center">
        <Image src="/signup-illustration-3.svg" />
      </Flex>
      <Header
        title="Wallet created succesfully"
        subtitle="These are your Fuel wallet details"
      />
      {account && <AccountItem account={account} />}
      <Button size="sm" color="accent" onPress={() => navigate("/wallet")}>
        Go to wallet
      </Button>
    </Stack>
  );
}
