import { Box } from '@fuel-wallet/ui';

import { ActivityItem } from '../ActivityItem';

import type { TransactionSummaryWithDomain } from '../../types';
import { ActivityListEmpty } from './ActivityListEmpty';
import { ActivityListLoading } from './ActivityListLoading';

export interface ActivityListProps {
  txs: TransactionSummaryWithDomain[];
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
    <Box.Stack gap="$2" className="fuel-stagger">
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
