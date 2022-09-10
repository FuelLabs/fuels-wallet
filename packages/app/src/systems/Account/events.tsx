import { createEvent } from "../Core/utils/mediator/useMediator";

import type { Account } from "./types";

enum Events {
  accountCreated = "accounts:ACCOUNT_CREATED",
}

export const accountCreated = createEvent<Account>(Events.accountCreated);
