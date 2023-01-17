import { CardList } from '@fuel-ui/react';

import { ActivityItem } from '../ActivityItem';

type ActivityListLoadingProps = {
  items?: number;
};

export function ActivityListLoading({ items = 5 }: ActivityListLoadingProps) {
  return (
    <CardList>
      {Array.from({ length: items }).map((_, idx) => (
        <ActivityItem.Loader key={idx} />
      ))}
    </CardList>
  );
}
