/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function GetSelectedAccount() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [
    handleGetSelectedAccount,
    isLoadingSelectedAccount,
    errorGetSelectedAccount,
  ] = useLoading(async () => {
    console.debug('Request getSelectedAccount to Wallet!');
    const selectedAccount = await fuel.getSelectedAccount();
    console.debug('Selected Account ', selectedAccount);
    setSelectedAccount(selectedAccount.address);
  });

  const errorMessage = errorGetSelectedAccount || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Button
          onPress={handleGetSelectedAccount}
          isLoading={isLoadingSelectedAccount}
          isDisabled={isLoadingSelectedAccount || !isConnected}
        >
          Get accounts
        </Button>
        <Stack gap="$3" css={{ mt: '$2' }}>
          <Tag size="xs" color="gray" variant="ghost">
            {!!selectedAccount && (
              <Text key={selectedAccount}>{selectedAccount}</Text>
            )}
          </Tag>
        </Stack>
      </Stack>
    </ExampleBox>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    display: 'inline-flex',
    alignItems: 'flex-start',

    '.fuel_tag > p': {
      fontSize: '$xs',
    },
  }),
};
