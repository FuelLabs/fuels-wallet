import { Box } from '@fuel-ui/react';

import { useAccountForm } from '../../hooks/useAccountForm';

import { AccountForm } from './AccountForm';

export default {
  component: AccountForm,
  title: 'Account/Components/AccountForm',
};

export const Usage = () => {
  const form = useAccountForm();
  return (
    <Box css={{ width: 320 }}>
      <AccountForm form={form} />
    </Box>
  );
};
