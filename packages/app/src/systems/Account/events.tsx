import { createEvent } from "@fuels-wallet/mediator";

import type { Account } from "./types";

enum Events {
  accountCreated = "accounts:ACCOUNT_CREATED",
}

export const accountCreated = createEvent<Account>(Events.accountCreated);
