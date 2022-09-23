import { createEvent } from "@fuels-wallet/mediator";

enum Events {
  updateAccounts = "accounts:UPDATE_ACCOUNTS",
}

export const updateAccounts = createEvent(Events.updateAccounts);
