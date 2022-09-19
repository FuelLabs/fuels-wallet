import { createEvent } from "@fuels-wallet/mediator";

import type { Account } from "./types";

enum Events {
  accountCreated = "accounts:ACCOUNT_CREATED",
  faucetSuccess = "accounts:FAUCET_SUCCESS",
}

export const accountCreated = createEvent<Account>(Events.accountCreated);
export const faucetSuccess = createEvent<void>(Events.faucetSuccess);
