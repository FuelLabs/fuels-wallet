import type { Account } from "./types";

import { createEvent } from "~/systems/Core/utils/mediator";

enum Events {
  accountCreated = "accounts:ACCOUNT_CREATED",
}

export const accountCreated = createEvent<Account>(Events.accountCreated);
