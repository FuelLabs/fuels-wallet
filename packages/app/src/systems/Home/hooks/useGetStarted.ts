import { bn } from 'fuels';
import { useEffect, useRef, useState } from 'react';
import { GET_STARTED_KEY, IS_CRX } from '~/config';
import { useAccounts } from '~/systems/Account';
import { Storage } from '~/systems/Core';
import { ConnectionService } from '~/systems/DApp/services';
import { useNetworks } from '~/systems/Network';

export type Milestone = 'secured' | 'pinned' | 'funded' | 'connected';

type GetStartedState = Partial<Record<Milestone, boolean>> & {
  dismissed?: boolean;
  /** Account and network pairs seen with no funds; funds showing up on one of these is a first deposit. */
  emptyKeys?: string[];
};

const MILESTONES: Milestone[] = IS_CRX
  ? ['secured', 'pinned', 'funded', 'connected']
  : ['secured', 'funded', 'connected'];

/* How long the first-funds and all-set moments hold before settling. */
export const MOMENT_MS = 2400;

function read(): GetStartedState | null {
  return Storage.getItem<GetStartedState>(GET_STARTED_KEY);
}

function write(patch: GetStartedState) {
  const current = read();
  if (!current) return;
  Storage.setItem(GET_STARTED_KEY, { ...current, ...patch });
}

async function isPinned() {
  try {
    const settings = await chrome.action?.getUserSettings?.();
    return Boolean(settings?.isOnToolbar);
  } catch {
    return false;
  }
}

/**
 * Milestones for a wallet created on this device. Wallets that existed
 * before this feature have no stored state and never see the checklist.
 */
export function useGetStarted() {
  const { account, isLoading } = useAccounts();
  const { network } = useNetworks();
  const [state, setState] = useState(read);
  const [isFirstFunds, setIsFirstFunds] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  function update(patch: GetStartedState) {
    write(patch);
    setState(read());
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: checked once per open
  useEffect(() => {
    if (!state || state.dismissed) return;
    update({ secured: true });
    if (IS_CRX && !state.pinned) {
      isPinned().then((pinned) => pinned && update({ pinned }));
    }
    if (!state.connected) {
      ConnectionService.getConnections().then(
        (connections) => connections.length && update({ connected: true })
      );
    }
  }, []);

  const hasFunds = Boolean(
    account?.balances?.some((balance) => bn(balance.amount).gt(0))
  );
  const fundsKey =
    account?.address && network?.url ? `${network.url}|${account.address}` : '';

  // biome-ignore lint/correctness/useExhaustiveDependencies: driven by the balance key
  useEffect(() => {
    if (!state || state.dismissed || state.funded || isLoading || !fundsKey) {
      return;
    }
    const emptyKeys = state.emptyKeys ?? [];
    if (!hasFunds) {
      if (!emptyKeys.includes(fundsKey)) {
        update({ emptyKeys: [...emptyKeys, fundsKey] });
      }
      return;
    }
    // Funds already there on a newly seen account or network are not a deposit.
    update({ funded: true, emptyKeys: [] });
    if (emptyKeys.includes(fundsKey)) {
      setIsFirstFunds(true);
      timer.current = setTimeout(() => setIsFirstFunds(false), MOMENT_MS);
    }
  }, [fundsKey, hasFunds, isLoading]);

  const milestones = MILESTONES.map((milestone) => ({
    milestone,
    isDone: Boolean(state?.[milestone]),
  }));

  return {
    isActive: Boolean(state) && !state?.dismissed,
    milestones,
    isFirstFunds,
    dismiss: () => update({ dismissed: true }),
  };
}
