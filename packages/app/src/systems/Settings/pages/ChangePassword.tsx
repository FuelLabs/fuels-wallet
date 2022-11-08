import { cssObj } from '@fuel-ui/css';
import { Alert, Button, InputPassword } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useSettings } from '../hooks/useSettings';

import { ControlledField, Layout, Pages } from '~/systems/Core';

const schema = yup
  .object({
    newPassword: yup
      .string()
      .min(8, 'Your new password must to have at least 8 characters')
      .required('New Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
    oldPassword: yup.string().required('Old Password is required'),
  })
  .required();

type ChangePasswordFormValues = {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
};

export function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword, isChangingPassword, hasChangedPassword } =
    useSettings();
  const { handleSubmit, control } = useForm<ChangePasswordFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (hasChangedPassword) {
      navigate(Pages.wallet());
    }
  }, [hasChangedPassword]);

  const goBack = () => navigate(Pages.wallet());
  return (
    <Layout title="Change Password">
      <Layout.TopBar onBack={() => goBack()} />
      <form
        style={{ flex: 1 }}
        onSubmit={() =>
          handleSubmit(({ newPassword, oldPassword }) =>
            changePassword({
              oldPassword,
              newPassword,
            })
          )
        }
      >
        <Layout.Content css={styles.wrapper}>
          <Alert direction="row" status={'warning'}>
            <Alert.Description>
              If you lose your password and your seed phrase, all you funds can
              be lost forever.
            </Alert.Description>
          </Alert>
          <ControlledField
            control={control}
            name="oldPassword"
            label="Old Password"
            render={({ field }) => (
              <InputPassword
                {...field}
                css={styles.input}
                size="sm"
                placeholder="Type your old password"
              />
            )}
          />
          <ControlledField
            control={control}
            name="newPassword"
            label="New Password"
            render={({ field }) => (
              <InputPassword
                {...field}
                css={styles.input}
                size="sm"
                placeholder="Type your new password"
              />
            )}
          />
          <ControlledField
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            render={({ field }) => (
              <InputPassword
                {...field}
                css={styles.input}
                size="sm"
                placeholder="Confirm your new password"
              />
            )}
          />
        </Layout.Content>
      </form>
      <Layout.BottomBar>
        <Button
          onPress={() => goBack()}
          variant="ghost"
          isLoading={isChangingPassword}
          isDisabled={isChangingPassword}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isChangingPassword}
          isDisabled={isChangingPassword}
        >
          Save
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  input: cssObj({
    w: '245px !important',
  }),
  wrapper: cssObj({
    display: 'flex',
    gap: '$6',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  }),
};
