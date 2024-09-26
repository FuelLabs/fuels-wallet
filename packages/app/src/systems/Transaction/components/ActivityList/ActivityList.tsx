import { Box } from '@fuel-ui/react';
import type { TransactionSummary } from 'fuels';

import { ActivityItem } from '../ActivityItem';

import { ActivityListEmpty } from './ActivityListEmpty';
import { ActivityListLoading } from './ActivityListLoading';

export interface ActivityListProps {
  txs: TransactionSummary[];
  providerUrl?: string;
  isLoading?: boolean;
  ownerAddress: string;
}

export const ActivityList = ({
  txs,
  isLoading,
  ownerAddress,
}: ActivityListProps) => {
  if (isLoading) return <ActivityList.Loading />;

  const isEmpty = !txs?.length;

  if (isEmpty) return <ActivityList.Empty />;

  return (
    <Box.Stack gap="$2">
      {txs.map((tx) => (
        <ActivityItem
          ownerAddress={ownerAddress}
          key={tx.id}
          transaction={tx}
        />
      ))}
    </Box.Stack>
  );
};

ActivityList.Empty = ActivityListEmpty;
ActivityList.Loading = ActivityListLoading;
