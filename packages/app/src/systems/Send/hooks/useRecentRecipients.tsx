import { Address, AddressType } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';
import { useTransactionHistory } from '~/systems/Transaction/hooks/useTransactionHistory';

const MAX_RECIPIENTS = 5;

export type RecentRecipient = {
  address: string;
  name?: string;
};

function toB256(address: string) {
  try {
    return Address.fromDynamicInput(address).toB256().toLowerCase();
  } catch {
    return undefined;
  }
}

/** Wallets the current account sent to, newest first, read from its history. */
export function useRecentRecipients() {
  const { account, accounts } = useAccounts();
  const { transactionHistory } = useTransactionHistory({
    address: account?.address,
  });

  return useMemo<RecentRecipient[]>(() => {
    const self = account?.address ? toB256(account.address) : undefined;
    if (!self || !transactionHistory) return [];

    const names = new Map<string, string>();
    for (const acc of accounts ?? []) {
      const key = toB256(acc.address);
      if (key) names.set(key, acc.name);
    }

    const seen = new Set<string>();
    const recipients: RecentRecipient[] = [];
    for (const tx of transactionHistory) {
      for (const op of tx.operations ?? []) {
        if (op.to?.type !== AddressType.account || !op.to.address) continue;
        if (!op.from?.address || toB256(op.from.address) !== self) continue;
        const key = toB256(op.to.address);
        if (!key || key === self || seen.has(key)) continue;
        seen.add(key);
        recipients.push({
          address: Address.fromDynamicInput(key).toChecksum(),
          name: names.get(key),
        });
        if (recipients.length === MAX_RECIPIENTS) return recipients;
      }
    }
    return recipients;
  }, [account?.address, accounts, transactionHistory]);
}
