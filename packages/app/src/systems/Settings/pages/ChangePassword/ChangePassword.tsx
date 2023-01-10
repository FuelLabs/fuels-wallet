import { cssObj } from '@fuel-ui/css';
import { Alert, Button, Flex, InputPassword } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useSettings } from '../../hooks/useSettings';

import { ControlledField, Layout } from '~/systems/Core';

const schema = yup
  .object({
    newPassword: yup
      .string()
      .min(8, 'Your new password must to have at least 8 characters')
      .required('New Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
    oldPassword: yup.string().required('Current Password is required'),
  })
  .required();

type ChangePasswordFormValues = {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
};

export function ChangePassword() {
  const { handlers, ...ctx } = useSettings();
  const { handleSubmit, control, trigger } = useForm<ChangePasswordFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  function onSubmit(values: ChangePasswordFormValues) {
    return handlers.changePassword(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout title="Change Password">
        <Layout.TopBar onBack={handlers.goBack} />
        <Layout.Content>
          <Flex css={styles.wrapper}>
            <Alert direction="row" status={'warning'}>
              <Alert.Description>
                If you lose your password and your seed phrase, all you funds
                can be lost forever.
              </Alert.Description>
            </Alert>
            <ControlledField
              control={control}
              name="oldPassword"
              label="Current Password"
              render={({ field }) => (
                <InputPassword
                  {...field}
                  css={styles.input}
                  aria-label="Current Password"
                  placeholder="Type your current password"
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
                  onBlur={() => {
                    trigger();
                    field.onBlur();
                  }}
                  css={styles.input}
                  aria-label="New Password"
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
                  aria-label="Confirm Password"
                  placeholder="Confirm your new password"
                />
              )}
            />
          </Flex>
        </Layout.Content>
        <Layout.BottomBar>
          <Button
            css={styles.cancelButton}
            onPress={handlers.goBack}
            isDisabled={ctx.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={ctx.isLoading}
            isDisabled={ctx.isLoading}
          >
            Save
          </Button>
        </Layout.BottomBar>
      </Layout>
    </form>
  );
}

const styles = {
  cancelButton: cssObj({
    background: '$gray2 !important',
    color: '$gray11 !important',
  }),
  input: cssObj({
    w: '235px !important',
  }),
  wrapper: cssObj({
    display: 'flex',
    gap: '$4',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  }),
};
