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

import { useFuel } from '~/src/hooks/useFuel';

export function ExampleBox({
  children,
  error,
  showNotDetectedOverlay = true,
}: {
  children: ReactNode;
  error?: any;
  showNotDetectedOverlay?: boolean;
}) {
  const [, notDetected, isLoading] = useFuel();
  const errorMsg = error?.response?.errors?.[0]?.message || error?.message;
  const shouldShowRawError = errorMsg !== error?.message;

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

  const NotDetectedOverlayDefault = (
    <Stack css={styles.overlay} justify="center" align="center">
      <Heading as="h6">Wallet not detected</Heading>
      <Link href="/docs/install">
        Please install the Fuel Wallet to use this demo.
      </Link>
    </Stack>
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
          Check it working
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
        {shouldShowRawError && (
          <Input css={{ width: '100%', height: 200 }}>
            <Input.Field
              as="textarea"
              value={error.message}
              css={{ color: '$red10', padding: '$2', height: '$full' }}
            />
          </Input>
        )}
        {children}
        {showNotDetectedOverlay && notDetected && NotDetectedOverlayDefault}
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
    position: 'relative',
    overflow: 'hidden',

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
  overlay: cssObj({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }),
};
