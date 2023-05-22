import { Button, InputPassword, Box } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Header } from '../Header';

import {
  ControlledField,
  ImageLoader,
  InputSecurePassword,
  relativeUrl,
} from '~/systems/Core';

const schema = yup
  .object({
    password: yup.string().test({
      name: 'is-strong',
      message: 'Password must be strong',
      test: (_, ctx) => ctx.parent.strength === 'strong',
    }),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Passwords must match'),
  })
  .required();

export type CreatePasswordValues = {
  password: string;
  confirmPassword: string;
  strength: string;
};

export type CreatePasswordProps = {
  isLoading?: boolean;
  onSubmit: (data: CreatePasswordValues) => void;
  onCancel: () => void;
};

export function CreatePassword({
  isLoading = false,
  onCancel,
  onSubmit,
}: CreatePasswordProps) {
  const form = useForm<CreatePasswordValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box.Stack gap="$6" align="center">
        <ImageLoader
          src={relativeUrl('/signup-illustration-2.svg')}
          width={129}
          height={116}
        />
        <Header
          title="Encrypt your wallet"
          subtitle="Add a safe password to encrypt your wallet"
        />
        <Box.Stack css={{ width: '100%' }} gap="$4">
          <ControlledField
            control={control}
            name="password"
            label="Password"
            hideError
            render={({ field }) => (
              <InputSecurePassword
                field={field}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                onChangeStrength={(strength: string) =>
                  setValue('strength', strength)
                }
                onBlur={() => {
                  form.trigger();
                  field.onBlur();
                }}
              />
            )}
          />
          <ControlledField
            control={control}
            name="confirmPassword"
            label="Confirm password"
            render={({ field }) => (
              <InputPassword
                {...field}
                autoComplete="new-password"
                placeholder="Confirm your password"
                aria-label="Confirm Password"
              />
            )}
          />
        </Box.Stack>
        <Box.Flex gap="$4">
          <Button variant="ghost" css={{ width: 130 }} onPress={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            intent="primary"
            css={{ width: 130 }}
            isDisabled={!isValid}
            isLoading={isLoading}
          >
            Next
          </Button>
        </Box.Flex>
      </Box.Stack>
    </form>
  );
}
