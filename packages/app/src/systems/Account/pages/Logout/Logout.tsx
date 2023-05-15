import {
  Button,
  Card,
  Dialog,
  Icon,
  IconButton,
  Input,
  Text,
} from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useAccounts } from '../../hooks';

import { ControlledField } from '~/systems/Core';

const schema = yup
  .object({
    logoutConfirmation: yup.string(),
  })
  .required();

export type FormValues = {
  logoutConfirmation: string;
};
const logOutConfirmationPhrase = 'I have my recovery phrase';

export const Logout = () => {
  const { isLoading, handlers } = useAccounts();

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      logoutConfirmation: '',
    },
  });
  const { control } = form;
  const isLogoutDisabled = useMemo(
    () =>
      isLoading ||
      form.getValues().logoutConfirmation !== logOutConfirmationPhrase,
    [isLoading, form]
  );
  return (
    <>
      <Dialog.Heading>
        Logout
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Card css={{ padding: '$4' }}>
          <Text
            as="h2"
            color="gray12"
            leftIcon={<Icon icon={Icon.is('Warning')} color="yellow12" />}
            css={{ mb: '$4' }}
          >
            IMPORTANT
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            This action will remove all data from this device, including your
            seedphrase and accounts.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            Make sure you have securely backed up your Seed Phrase before
            removing the wallet.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            If you have not backed up your Seed Phrase, you will lose access to
            your funds.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}></Text>
        </Card>
      </Dialog.Description>
      <ControlledField
        control={control}
        name="logoutConfirmation"
        label={
          <p>
            Write <i>{logOutConfirmationPhrase}</i> to logout
          </p>
        }
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              aria-label="Confirm Log Out"
              placeholder={logOutConfirmationPhrase}
            />
          </Input>
        )}
      />
      <Dialog.Footer>
        <Button
          aria-label="Logout"
          onPress={handlers.logout}
          isLoading={isLoading}
          isDisabled={isLogoutDisabled}
          variant="ghost"
          color="red"
        >
          Logout
        </Button>
      </Dialog.Footer>
    </>
  );
};
