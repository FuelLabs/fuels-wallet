import { Box } from '@fuel-ui/react';

import { MOCK_ACCOUNTS } from '../../__mocks__';
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

export const WithValues = () => {
  const form = useAccountForm({
    defaultValues: MOCK_ACCOUNTS[0],
  });
  return (
    <Box css={{ width: 320 }}>
      <AccountForm form={form} />
    </Box>
  );
};
