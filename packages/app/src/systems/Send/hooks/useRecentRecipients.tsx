import { Address, AddressType } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';
import { useTransactionHistory } from '~/systems/Transaction/hooks/useTransactionHistory';

const MAX_RECIPIENTS = 5;

export type RecentRecipient = {
  address: string;
  name?: string;
};

export function toB256(address: string) {
  try {
    return Address.fromDynamicInput(address).toB256().toLowerCase();
  } catch {
    return undefined;
  }
}

export type Recipients = {
  /** Newest first, at most five. */
  recents: RecentRecipient[];
  /** Sends per recipient, keyed by lowercase b256; undefined until history loads. */
  sentCounts?: Map<string, number>;
  /** Own account names, keyed by lowercase b256. */
  ownNames: Map<string, string>;
};

/** Wallets the current account sent to, read from its history. */
export function useRecentRecipients(): Recipients {
  const { account, accounts } = useAccounts();
  const { transactionHistory } = useTransactionHistory({
    address: account?.address,
    quiet: true,
  });

  return useMemo<Recipients>(() => {
    const names = new Map<string, string>();
    for (const acc of accounts ?? []) {
      const key = toB256(acc.address);
      if (key) names.set(key, acc.name);
    }

    const self = account?.address ? toB256(account.address) : undefined;
    if (!self || !transactionHistory) return { recents: [], ownNames: names };

    const sentCounts = new Map<string, number>();
    const recents: RecentRecipient[] = [];
    for (const tx of transactionHistory) {
      const sentTo = new Set<string>();
      for (const op of tx.operations ?? []) {
        if (op.to?.type !== AddressType.account || !op.to.address) continue;
        if (!op.from?.address || toB256(op.from.address) !== self) continue;
        const key = toB256(op.to.address);
        if (!key || key === self) continue;
        sentTo.add(key);
      }
      for (const key of sentTo) {
        if (!sentCounts.has(key) && recents.length < MAX_RECIPIENTS) {
          recents.push({
            address: Address.fromDynamicInput(key).toChecksum(),
            name: names.get(key),
          });
        }
        sentCounts.set(key, (sentCounts.get(key) ?? 0) + 1);
      }
    }
    return { recents, sentCounts, ownNames: names };
  }, [account?.address, accounts, transactionHistory]);
}
