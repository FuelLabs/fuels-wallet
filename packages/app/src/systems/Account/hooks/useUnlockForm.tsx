import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';

import { store, Services } from '~/store';
import { Pages } from '~/systems/Core';

const schema = yup
  .object({
    password: yup.string().min(8).required('Password is required'),
  })
  .required();

export type UseUnlockFormReturn = ReturnType<typeof useUnlockForm>;

export type UnlockFormValues = {
  password: string;
};

export function useUnlockForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const form = useForm<UnlockFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  store.useSetMachineConfig(Services.account, {
    actions: {
      redirectToStatePath() {
        navigate(location.state?.lastPage ?? Pages.wallet());
      },
    },
  });

  return form;
}
