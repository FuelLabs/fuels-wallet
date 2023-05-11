import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Button, InputPassword } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useSettings } from '../../hooks/useSettings';

import {
  ControlledField,
  InputSecurePassword,
  Layout,
  Pages,
} from '~/systems/Core';

const schema = yup
  .object({
    newPassword: yup.string().test({
      name: 'is-strong',
      message: 'Password must be strong',
      test: (_, ctx) => ctx.parent.strength === 'strong',
    }),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Passwords must match'),
    currentPassword: yup.string().required('Current Password is required'),
  })
  .required();

type ChangePasswordFormValues = {
  password: string;
  confirmPassword: string;
  currentPassword: string;
  strength: string;
};

export function ChangePassword() {
  const navigate = useNavigate();
  const { handlers, isChangingPassword } = useSettings();
  const form = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
      currentPassword: '',
    },
  });
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { isValid },
  } = form;

  function onSubmit(values: ChangePasswordFormValues) {
    if (values.confirmPassword !== values.password) {
      return setError('confirmPassword', {
        message: 'Passwords must match',
      });
    }
    return handlers.changePassword(values);
  }

  const goBack = () => navigate(Pages.wallet());

  return (
    <form style={{ flex: 1 }} onSubmit={handleSubmit(onSubmit)}>
      <Layout title="Change Password">
        <Layout.TopBar onBack={goBack} />
        <Layout.Content>
          <Box.Flex css={styles.wrapper}>
            <Alert direction="row" status={'warning'}>
              <Alert.Description>
                If you lose your password and your seed phrase, all you funds
                can be lost forever.
              </Alert.Description>
            </Alert>
            <ControlledField
              control={control}
              name="currentPassword"
              label="Current Password"
              render={({ field }) => (
                <InputPassword
                  {...field}
                  autoComplete="current-password"
                  css={styles.input}
                  aria-label="Current Password"
                  placeholder="Type your current password"
                />
              )}
            />
            <ControlledField
              control={control}
              name="password"
              label="New Password"
              hideError
              render={({ field }) => (
                <InputSecurePassword
                  field={field}
                  onChangeStrength={(strength: string) =>
                    setValue('strength', strength)
                  }
                  onBlur={() => {
                    form.trigger();
                    field.onBlur();
                  }}
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                  ariaLabel="New Password"
                  placeholder="Type your new password"
                  css={styles.input}
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
                  autoComplete="new-password"
                  css={styles.input}
                  aria-label="Confirm Password"
                  placeholder="Confirm your new password"
                />
              )}
            />
          </Box.Flex>
        </Layout.Content>
        <Layout.BottomBar>
          <Button
            css={styles.cancelButton}
            onPress={goBack}
            isDisabled={isChangingPassword}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isChangingPassword}
            isDisabled={!isValid}
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
    background: '$intentsBase2 !important',
    color: '$intentsBase11 !important',
  }),
  input: cssObj({
    '&.fuel_input--field, & .fuel_input--field': {
      w: '235px !important',
    },
  }),
  wrapper: cssObj({
    display: 'flex',
    gap: '$4',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  }),
};
