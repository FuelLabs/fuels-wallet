import type { PermissionCardProps } from './PermissionCard';
import { PermissionCard } from './PermissionCard';
import { NOT_ALLOWED_LIST, PERMISSION_LIST } from './mocks';

export default {
  component: PermissionCard,
  title: 'Core/Components/PermissionCard',
};

export const Usage = (args: PermissionCardProps) => (
  <PermissionCard {...args} />
);
Usage.args = {
  headerText: 'This site would be able to:',
  allowed: PERMISSION_LIST,
  notAllowed: NOT_ALLOWED_LIST,
};
