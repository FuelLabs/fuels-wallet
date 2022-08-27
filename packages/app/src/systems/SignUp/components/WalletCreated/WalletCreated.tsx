import { Stack, Image, Button, Flex } from "@fuel-ui/react";

import { Header } from "../Header";

import type { Account } from "~/systems/Account";
import { AccountItem } from "~/systems/Account";

export type WalletCreatedProps = {
  account: Account;
};

export function WalletCreated({ account }: WalletCreatedProps) {
  return (
    <Stack gap="$6">
      <Flex justify="center">
        <Image src="/signup-illustration-3.svg" />
      </Flex>
      <Header
        title="Wallet created succesfully"
        subtitle="These are your Fuel wallet details"
      />
      <AccountItem account={account} />
      <Button size="sm" color="accent">
        Go to wallet
      </Button>
    </Stack>
  );
}
