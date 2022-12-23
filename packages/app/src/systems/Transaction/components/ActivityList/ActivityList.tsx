import type { Tx } from '../../utils';
import { ActivityItem } from '../ActivityItem';

import { ActivityListEmpty } from './ActivityListEmpty';
import { ActivityListLoading } from './ActivityListLoading';

interface ActivityListProps {
  transactions: Tx[];
  providerUrl?: string;
  isLoading?: boolean;
  isDevnet?: boolean;
}

export const ActivityList = ({
  transactions,
  isDevnet,
  isLoading,
}: ActivityListProps) => {
  if (isLoading) return <ActivityList.Loading />;

  const isEmpty = !transactions || !transactions.length;

  if (isEmpty) return <ActivityList.Empty isDevnet={isDevnet} />;

  return (
    <div>
      {transactions.map((transaction) => (
        <ActivityItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

ActivityList.Empty = ActivityListEmpty;
ActivityList.Loading = ActivityListLoading;
