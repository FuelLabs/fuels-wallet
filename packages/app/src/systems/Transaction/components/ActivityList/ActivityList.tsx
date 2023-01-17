import { Stack } from '@fuel-ui/react';

import type { Tx } from '../../utils';
import { ActivityItem } from '../ActivityItem';

import { ActivityListEmpty } from './ActivityListEmpty';
import { ActivityListLoading } from './ActivityListLoading';

export interface ActivityListProps {
  txs: Tx[];
  providerUrl?: string;
  isLoading?: boolean;
  isDevnet?: boolean;
  ownerAddress: string;
}

export const ActivityList = ({
  txs,
  isDevnet = false,
  isLoading,
  ownerAddress,
}: ActivityListProps) => {
  if (isLoading) return <ActivityList.Loading />;

  const isEmpty = !txs?.length;

  if (isEmpty) return <ActivityList.Empty isDevnet={isDevnet} />;

  return (
    <Stack gap="$2">
      {txs.map((tx) => (
        <ActivityItem
          ownerAddress={ownerAddress}
          key={tx.id}
          transaction={tx}
        />
      ))}
    </Stack>
  );
};

ActivityList.Empty = ActivityListEmpty;
ActivityList.Loading = ActivityListLoading;
