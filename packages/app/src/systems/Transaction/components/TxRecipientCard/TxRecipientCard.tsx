import { cssObj } from "@fuel-ui/css";
import { Avatar, Box, Card, Copyable, Flex, Icon, Text } from "@fuel-ui/react";

import type { Account } from "~/systems/Account";
import { shortAddress } from "~/systems/Core";

export type TxRecipientCardProps = {
  account?: Account;
  contract?: { address: string };
};

export function TxRecipientCard({ account, contract }: TxRecipientCardProps) {
  const address = account ? account.address : contract?.address;
  return (
    <Card css={styles.root}>
      <Text css={styles.from}>From</Text>
      {account && (
        <Avatar.Generated
          role="img"
          size="lg"
          hash={account.address}
          aria-label={account.name}
          background="fuel"
        />
      )}
      {contract && (
        <Box css={styles.iconWrapper}>
          <Icon icon={Icon.is("Code")} size={22} />
        </Box>
      )}
      <Flex css={styles.info}>
        {contract && <Text css={styles.from}>Contract</Text>}
        {address && (
          <Copyable value={address}>{shortAddress(address)}</Copyable>
        )}
      </Flex>
    </Card>
  );
}

const styles = {
  root: cssObj({
    width: "122px",
    padding: "$4",
    display: "inline-flex",
    alignItems: "center",
    gap: "$3",

    ".fuel_copyable": {
      color: "$gray12",
      fontSize: "$sm",
      fontWeight: "$semibold",
    },
  }),
  from: cssObj({
    fontWeight: "$semibold",
  }),
  iconWrapper: cssObj({
    padding: "$4",
    background: "$gray3",
    borderRadius: "$full",
  }),
  info: cssObj({
    flexDirection: "column",
    alignItems: "center",
    gap: "$1",
  }),
};
