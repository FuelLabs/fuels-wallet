import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { Address, isB256 } from 'fuels';
import { useWatch } from 'react-hook-form';
import { Layout, MotionStack, animations, coreStyles } from '~/systems/Core';

import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Send } from '../../components';
import { useSend } from '../../hooks';

const CHECKSUM_MESSAGE =
  "We couldn't verify the address. Make sure you are sending to a valid address.";

export function SendPage() {
  const send = useSend();
  const { handlers, txRequest, status, form, readyToSend, nameSystem } = send;
  const { handlers: nameSystemHandlers } = nameSystem;
  const [warningMessage, setWarningMessage] = useState<string | undefined>(
    undefined
  );
  const address = useWatch({
    control: form.control,
    name: 'address',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    nameSystemHandlers.clear();

    if (address) {
      if (nameSystemHandlers.isName(address)) {
        nameSystemHandlers.getResolver(address);
        return;
      }

      if (isB256(address)) {
        nameSystemHandlers.getName(address);
        const isValid = Address.isChecksumValid(address);
        setWarningMessage(isValid ? undefined : CHECKSUM_MESSAGE);
        return;
      }
    }
    setWarningMessage(undefined);
  }, [address]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const isName = nameSystemHandlers.isName(address);
    if (isName && nameSystem.resolver.isSuccess && !nameSystem.resolver.value) {
      form.setError('address', {
        type: 'manual',
        message: 'No resolver for domain provided',
      });
    }
  }, [address, nameSystem.resolver.value]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handlers.submit)}
        data-testid={txRequest.txStatus}
        autoComplete="off"
      >
        <Layout title="Send" isLoading={status('loading')}>
          <Layout.TopBar onBack={handlers.cancel} />
          <MotionStack
            {...animations.slideInTop()}
            gap="$4"
            css={styles.content}
          >
            <Send.Select {...send} warningMessage={warningMessage} />
          </MotionStack>
          {txRequest.shouldShowActions && (
            <Layout.BottomBar>
              <Button variant="ghost" onPress={handlers.cancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                intent="primary"
                isDisabled={!readyToSend || !form.formState.isValid}
                isLoading={status('loading') || status('loadingTx')}
              >
                Review
              </Button>
            </Layout.BottomBar>
          )}
        </Layout>
      </form>
    </FormProvider>
  );
}

const styles = {
  content: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'scroll !important',
    '&::-webkit-scrollbar': {
      width: '$1',
      backgroundColor: 'transparent',
    },
    flex: 1,
  }),
};
