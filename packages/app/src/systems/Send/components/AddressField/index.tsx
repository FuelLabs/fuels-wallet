import { cssObj, Box } from '@fuel-wallet/ui';
import { useFormContext } from 'react-hook-form';
import { ControlledField } from '~/systems/Core';
import { NameSystemInput } from '~/systems/NameSystem/components/NameSystemInput';
import { useRecentRecipients } from '../../hooks/useRecentRecipients';

interface AddressFieldProps {
  warningMessage?: string;
}

export function AddressField({ warningMessage }: AddressFieldProps) {
  const { control, formState, setError, clearErrors } = useFormContext();
  const recents = useRecentRecipients();

  const handleChangeError = (error: string | null) => {
    if (error) {
      return setError('address', {
        message: error,
        type: 'validate',
      });
    }
    clearErrors('address');
  };

  return (
    <Box css={styles.addressRow}>
      <ControlledField
        isRequired
        name="address"
        control={control}
        warning={warningMessage}
        isInvalid={
          Boolean(formState.errors?.address) && !formState.isValidating
        }
        render={({ field }) => (
          <NameSystemInput
            {...field}
            recents={recents}
            onError={handleChangeError}
          />
        )}
      />
    </Box>
  );
}

const styles = {
  addressRow: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',

    '.error-msg': {
      fontSize: '$sm',
      color: '$intentsError9',
    },
  }),
};
