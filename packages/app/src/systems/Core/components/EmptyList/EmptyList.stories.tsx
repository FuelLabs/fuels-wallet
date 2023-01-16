import { EmptyList } from './EmptyList';

export default {
  component: EmptyList,
  title: 'Core/Components/EmptyList',
  parameters: {
    layout: 'centered',
  },
};

export const Usage = () => <EmptyList label="No items found" />;
