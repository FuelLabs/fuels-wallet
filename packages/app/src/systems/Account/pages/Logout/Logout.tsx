import { cssObj } from '@fuel-ui/css';
import { Button, Card, Dialog, Icon, Input, Text } from '@fuel-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useAccounts } from '../../hooks';

import { ControlledField, styles as rootStyles } from '~/systems/Core';
import { OverlayDialogTopbar } from '~/systems/Overlay';

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
  const isLogoutDisabled =
    isLoading ||
    form.getValues().logoutConfirmation !== logOutConfirmationPhrase;
  return (
    <>
      <OverlayDialogTopbar onClose={handlers.closeDialog}>
        Logout
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={rootStyles.content}>
        <Card css={styles.card}>
          <Text
            as="h2"
            color="intentsBase12"
            leftIcon={
              <Icon icon={Icon.is('AlertTriangle')} color="intentsWarning12" />
            }
            css={styles.line}
          >
            IMPORTANT
          </Text>
          <Text css={styles.line}>
            This action will remove all data from this device, including your
            seedphrase and accounts.
          </Text>
          <Text css={styles.line}>
            Make sure you have securely backed up your Seed Phrase before
            removing the wallet.
          </Text>
          <Text css={styles.line}>
            If you have not backed up your Seed Phrase, you will lose access to
            your funds.
          </Text>
        </Card>
        <ControlledField
          control={control}
          name="logoutConfirmation"
          label={`Write "${logOutConfirmationPhrase}" to confirm`}
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
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          aria-label="Logout"
          onPress={handlers.logout}
          isLoading={isLoading}
          isDisabled={isLogoutDisabled}
          variant="ghost"
          intent="error"
        >
          Logout
        </Button>
      </Dialog.Footer>
    </>
  );
};

const styles = {
  card: {
    padding: '$4',
  },
  line: cssObj({
    mb: '$2',
    color: '$intentsBase11',
  }),
};
