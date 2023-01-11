import { Stack } from '@fuel-ui/react';

import type { Tx } from '../../utils';
import { ActivityItem } from '../ActivityItem';

import { ActivityListEmpty } from './ActivityListEmpty';
import { ActivityListLoading } from './ActivityListLoading';

export interface ActivityListProps {
  transactions: Tx[];
  providerUrl?: string;
  isLoading?: boolean;
  isDevnet?: boolean;
  ownerAddress: string;
}

export const ActivityList = ({
  transactions,
  isDevnet = false,
  isLoading,
  ownerAddress,
}: ActivityListProps) => {
  if (isLoading) return <ActivityList.Loading />;

  const isEmpty = !transactions?.length;

  if (isEmpty) return <ActivityList.Empty isDevnet={isDevnet} />;

  return (
    <Stack gap="$2">
      {transactions.map((transaction) => (
        <ActivityItem
          ownerAddress={ownerAddress}
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </Stack>
  );
};

ActivityList.Empty = ActivityListEmpty;
ActivityList.Loading = ActivityListLoading;
