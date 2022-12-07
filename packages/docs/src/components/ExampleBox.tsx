/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Input,
  Link,
  Spinner,
  Stack,
  Tag,
  Tooltip,
} from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { capitalize } from '../lib/str';

import { Heading } from './Heading';

import { useFuelWeb3 } from '~/src/hooks/useFuelWeb3';

export function ExampleBox({
  children,
  error,
}: {
  children: ReactNode;
  error?: any;
}) {
  const [, notDetected, isLoading] = useFuelWeb3();
  const errorMsg = error?.response?.errors?.[0]?.message;
  const downloadContent = (
    <>
      {notDetected && (
        <Box as="span" css={{ ml: '$2' }}>
          <Link
            download={true}
            href={process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL}
          >
            Download Wallet
          </Link>
        </Box>
      )}
    </>
  );

  if (isLoading) {
    return (
      <Box
        css={{ ...styles.root, justifyContent: 'center', alignItems: 'center' }}
      >
        <Spinner size={20} color="gray4" />
      </Box>
    );
  }
  return (
    <Stack gap="$4" css={{ mt: '$8' }}>
      {errorMsg && (
        <Alert css={styles.alert} status="error">
          <Alert.Description>{capitalize(errorMsg)}</Alert.Description>
        </Alert>
      )}
      <Box css={styles.root}>
        <Heading as="h6">
          Check it working{' '}
          {notDetected && !error && (
            <Tooltip content={downloadContent} side="left">
              <Tag size="xs" color="amber" variant="ghost" leftIcon="Warning">
                Not working
              </Tag>
            </Tooltip>
          )}
          {error && !notDetected && (
            <Tag size="xs" color="red" variant="ghost" leftIcon="X">
              Failed
            </Tag>
          )}
          {!notDetected && !error && (
            <Tag size="xs" color="accent" variant="ghost">
              Wallet Detected
            </Tag>
          )}
        </Heading>
        {error && (
          <Input css={{ width: '100%', height: 200 }}>
            <Input.Field
              as="textarea"
              value={error.message}
              css={{ color: '$red10', padding: '$2', height: '$full' }}
            />
          </Input>
        )}
        {children}
      </Box>
    </Stack>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    padding: '$4',
    borderRadius: '$md',
    border: '1px dashed $gray3',

    h6: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '$0',
      color: '$gray10',
      gap: '$2',

      '& .fuel_icon': {
        color: 'currentColor',
      },
    },
  }),
  alert: cssObj({
    maxWidth: '100%',
  }),
};
