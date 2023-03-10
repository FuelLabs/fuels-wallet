import { Box } from '@fuel-ui/react';

import { useImportAccountForm } from '../../hooks/useImportAccountForm';

import { ImportAccountForm } from './ImportAccountForm';

export default {
  component: ImportAccountForm,
  title: 'Account/Components/ImportAccountForm',
};

export const Usage = () => {
  const form = useImportAccountForm({ accounts: [] });
  return (
    <Box css={{ width: 320 }}>
      <ImportAccountForm form={form} />
    </Box>
  );
};
