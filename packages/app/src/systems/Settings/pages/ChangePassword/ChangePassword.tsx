import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Button, Focus, InputPassword } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'lodash.debounce';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import {
  ControlledField,
  InputSecurePassword,
  Layout,
  Pages,
} from '~/systems/Core';

import { useSettings } from '../../hooks/useSettings';

const schema = yup
  .object({
    password: yup.string().test({
      name: 'is-strong',
      message: 'Password must be strong',
      test: (_, ctx) => ctx.parent.strength === 'strong',
    }),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Passwords must match')
      .notOneOf(
        [yup.ref('currentPassword')],
        'New password cannot be the same as the current password'
      ),
    currentPassword: yup.string().required('Current password is required'),
    strength: yup.string().required(),
  })
  .required();

type ChangePasswordFormValues = {
  password?: string;
  confirmPassword?: string;
  currentPassword: string;
  strength: string;
};

export function ChangePassword() {
  const navigate = useNavigate();
  const { error, handlers, isChangingPassword } = useSettings();
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
    trigger,
  } = form;

  const debouncedValidate = useCallback(
    debounce(() => {
      trigger('confirmPassword');
    }, 500),
    []
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (error) {
      setError('currentPassword', { message: error });
    }
  }, [error]);

  function onSubmit(values: ChangePasswordFormValues) {
    if (values.currentPassword === values.password) {
      return setError('confirmPassword', {
        message: 'New password cannot be the same as the current password',
      });
    }
    if (values.confirmPassword !== values.password) {
      return setError('confirmPassword', {
        message: 'Passwords must match',
      });
    }
    if (values.password && values.confirmPassword) {
      return handlers.changePassword({
        password: values.password,
        currentPassword: values.currentPassword,
      });
    }

    return undefined;
  }

  const goBack = () => navigate(Pages.wallet());

  return (
    <form style={{ flex: 1 }} onSubmit={handleSubmit(onSubmit)}>
      <Layout title="Change Password">
        <Layout.TopBar onBack={goBack} />
        <Layout.Content>
          <Box.Flex css={styles.wrapper}>
            <Alert status="warning">
              <Alert.Description>
                If you lose your password and your Seed Phrase, all your funds
                can be lost forever.
              </Alert.Description>
            </Alert>
            <Focus.Scope contain autoFocus>
              <ControlledField
                control={control}
                name="currentPassword"
                label="Current Password"
                render={({ field }) => (
                  <InputPassword
                    {...field}
                    autoComplete="new-password"
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
                    onChange={(e) => {
                      field.onChange(e);
                      if (form.getValues('confirmPassword')) {
                        debouncedValidate();
                      }
                    }}
                    onChangeStrength={(strength: string) =>
                      setValue('strength', strength)
                    }
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
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedValidate();
                    }}
                  />
                )}
              />
            </Focus.Scope>
          </Box.Flex>
        </Layout.Content>
        <Layout.BottomBar>
          <Button
            onPress={goBack}
            variant="ghost"
            isDisabled={isChangingPassword}
          >
            Cancel
          </Button>
          <Button
            intent="primary"
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
  input: cssObj({
    '&.fuel_InputField, & .fuel_InputField': {
      w: '235px !important',
    },
  }),
  wrapper: cssObj({
    display: 'flex',
    gap: '$4',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    '& .fuel_FormControl': {
      maxWidth: '100%',
    },
  }),
};
