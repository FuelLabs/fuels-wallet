import { CardList } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';

import { connectionsLoader } from '../../__mocks__/connection';

import type { ConnectionItemProps } from './ConnectionItem';
import { ConnectionItem } from './ConnectionItem';

export default {
  component: ConnectionItem,
  title: 'Settings/Components/ConnectionItem',
  loaders: [connectionsLoader],
};

type LoadedProps = {
  loaded: {
    connection1: ConnectionItemProps['connection'];
  };
};

export const Usage = (
  _args: ConnectionItemProps,
  { loaded: { connection1: connection } }: LoadedProps
) => (
  <CardList css={{ maxWidth: 300 }}>
    <ConnectionItem
      connection={connection}
      onEdit={action('onEdit')}
      onDelete={action('onDelete')}
    />
  </CardList>
);

export const Loader = (_args: ConnectionItemProps) => (
  <CardList css={{ maxWidth: 300 }}>
    <ConnectionItem.Loader />
  </CardList>
);
