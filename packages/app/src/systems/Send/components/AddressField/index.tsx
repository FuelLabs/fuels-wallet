import { cssObj, Box, Text } from '@fuel-wallet/ui';
import { useFormContext, useWatch } from 'react-hook-form';
import { ControlledField } from '~/systems/Core';
import { NameSystemInput } from '~/systems/NameSystem/components/NameSystemInput';
import {
  type Recipients,
  toB256,
  useRecentRecipients,
} from '../../hooks/useRecentRecipients';

interface AddressFieldProps {
  warningMessage?: string;
}

function familiarity(address: string, recipients: Recipients) {
  const key = address ? toB256(address) : undefined;
  if (!key) return null;
  const ownName = recipients.ownNames.get(key);
  if (ownName) return { kind: 'own', text: `Your account: ${ownName}` };
  if (!recipients.sentCounts) return null;
  const count = recipients.sentCounts.get(key) ?? 0;
  if (!count) return { kind: 'new', text: 'First transfer to this address' };
  return {
    kind: 'known',
    text: `Sent before, ${count} ${count === 1 ? 'time' : 'times'}`,
  };
}

export function AddressField({ warningMessage }: AddressFieldProps) {
  const { control, formState, setError, clearErrors } = useFormContext();
  const recipients = useRecentRecipients();
  const address = useWatch({ control, name: 'address' });
  const hasError = Boolean(formState.errors?.address);
  const known = hasError ? null : familiarity(address, recipients);

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
        isInvalid={hasError && !formState.isValidating}
        render={({ field }) => (
          <NameSystemInput
            {...field}
            recents={recipients.recents}
            onError={handleChangeError}
          />
        )}
      />
      {known && (
        <Text
          key={known.text}
          aria-label="Recipient history"
          className="familiarity"
          data-kind={known.kind}
        >
          <span
            className="fuel-square"
            data-kind={known.kind === 'new' ? 'idle' : undefined}
            aria-hidden
          />
          {known.text}
        </Text>
      )}
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
    '.familiarity': {
      display: 'flex',
      alignItems: 'center',
      gap: '$2',
      mt: '$2',
      fontFamily: '$mono',
      fontSize: '11px',
      lineHeight: '16px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: '$textLow',
      animation: 'fuel-appear 200ms var(--fuel-ease-out) backwards',
    },
    '.familiarity:not([data-kind="new"])': {
      color: '$textMid',
    },
    '.familiarity:not([data-kind="new"]) .fuel-square': {
      animation: 'fuel-pop 520ms var(--fuel-ease-out) both',
    },

    '@media (prefers-reduced-motion: reduce)': {
      '.familiarity, .familiarity .fuel-square': {
        animation: 'none !important',
      },
    },
  }),
};
