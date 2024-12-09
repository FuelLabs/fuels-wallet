import { cssObj } from '@fuel-ui/css';
import { Box, Button, InputPassword } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { IS_DEVELOPMENT } from '~/config';
import {
  ControlledField,
  InputSecurePassword,
  MotionStack,
  animations,
} from '~/systems/Core';

import { useSignUpStepper } from '../../hooks';
import { Header } from '../Header';
import { Stepper } from '../Stepper';

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
    strength: yup.string(),
  })
  .required();

export type CreatePasswordValues = {
  password?: string;
  confirmPassword?: string;
  strength?: string;
};

export type CreatePasswordProps = {
  step: number;
  isLoading?: boolean;
  onSubmit: (data: CreatePasswordValues) => void;
  onCancel: () => void;
};

export function CreatePassword({
  step,
  isLoading = false,
  onCancel,
  onSubmit,
}: CreatePasswordProps) {
  const { steps } = useSignUpStepper();

  const form = useForm<CreatePasswordValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
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
    trigger,
  } = form;

  const debouncedValidate = useCallback(
    debounce(() => {
      trigger('confirmPassword');
    }, 500),
    []
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box.Stack gap="$6" align="center">
        <Stepper steps={steps} active={step} />
        <Header
          title="Create password for encryption"
          subtitle="This password will be used to unlock your wallet."
        />
        <MotionStack {...animations.slideInRight()} gap="$6" align="center">
          <Box.Stack css={styles.content} gap="$4">
            <ControlledField
              control={control}
              name="password"
              label="Password"
              hideError
              render={({ field }) => (
                <InputSecurePassword
                  field={field}
                  inputProps={{
                    autoFocus: true,
                    autoComplete: 'new-password',
                  }}
                  onChangeStrength={(strength: string) =>
                    setValue('strength', strength)
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    if (form.getValues('confirmPassword')) {
                      debouncedValidate();
                    }
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
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedValidate();
                  }}
                />
              )}
            />
          </Box.Stack>
          <Box.Flex gap="$4" css={styles.footer}>
            <Button variant="ghost" onPress={onCancel}>
              Back
            </Button>
            <Button
              type="submit"
              intent="primary"
              isDisabled={!isValid}
              isLoading={isLoading}
            >
              Next: Finish set-up
            </Button>
          </Box.Flex>
        </MotionStack>
      </Box.Stack>
    </form>
  );
}

const styles = {
  footer: cssObj({
    width: '$full',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '$4',
  }),
  content: cssObj({
    width: '$sm',
  }),
};
