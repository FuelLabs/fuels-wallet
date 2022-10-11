import { Alert, Button, Icon, InputPassword, Stack } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useAccount } from '../../hooks';

import { Services, store } from '~/store';
import { ControlledField, Layout, Pages } from '~/systems/Core';

const schema = yup
  .object({
    password: yup.string().min(8).required('Password is required'),
  })
  .required();

type UnlockFormValues = {
  password: string;
};

export type UnlockProps = {
  ghostChildren?: ReactNode;
};

export function Unlock({ ghostChildren }: UnlockProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { handlers, isLoading, isLocked } = useAccount();
  const form = useForm<UnlockFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  function onSubmit(values: UnlockFormValues) {
    handlers.unlock(values.password);
  }

  store.useSetMachineConfig(Services.account, {
    actions: {
      redirectToStatePath() {
        if (!ghostChildren) {
          navigate(location.state?.lastPage ?? Pages.wallet());
        }
      },
    },
  });

  if (!isLocked && ghostChildren) {
    return <>{ghostChildren}</>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout title="Unlock Account">
        <Layout.TopBar />
        <Layout.Content>
          <Stack gap="$4">
            <Alert status="info">
              You need to unlock your wallet to be able to make transactions and
              more-sensitive actions.
            </Alert>
            <ControlledField
              control={control}
              name="password"
              label="Password"
              render={({ field }) => (
                <InputPassword
                  {...field}
                  placeholder="Type your password"
                  aria-label="Your Password"
                />
              )}
            />
          </Stack>
        </Layout.Content>
        <Layout.BottomBar>
          <Button
            type="submit"
            color="accent"
            isDisabled={!isValid}
            isLoading={isLoading}
            leftIcon={Icon.is('LockKeyOpen')}
          >
            Unlock
          </Button>
        </Layout.BottomBar>
      </Layout>
    </form>
  );
}
