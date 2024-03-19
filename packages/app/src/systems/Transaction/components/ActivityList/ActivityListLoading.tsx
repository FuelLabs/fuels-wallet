import { CardList } from '@fuel-ui/react';

import { ActivityItem } from '../ActivityItem';

type ActivityListLoadingProps = {
  items?: number;
};

export function ActivityListLoading({ items = 5 }: ActivityListLoadingProps) {
  return (
    <CardList>
      {Array.from({ length: items }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <ActivityItem.Loader key={idx} />
      ))}
    </CardList>
  );
}
