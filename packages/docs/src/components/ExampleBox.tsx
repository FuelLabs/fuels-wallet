import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Input, Link, Spinner, Tag, Tooltip } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { useFuel } from '../hooks/useFuel';
import { capitalize } from '../lib/str';

import { useExtensionTitle } from '../hooks/useExtensionTitle';
import { Heading } from './Heading';

export function ExampleBox({
  children,
  error,
  overlayContent,
  showNotDetectedOverlay = true,
}: {
  children: ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error?: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  overlayContent?: any;
  showNotDetectedOverlay?: boolean;
}) {
  const extensionName = useExtensionTitle();
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
    <Box.Stack css={styles.overlay} justify="center" align="center">
      <Heading as="h6">Wallet not detected</Heading>
      <Link href="/docs/install">
        Please install {extensionName} to use this demo.
      </Link>
    </Box.Stack>
  );

  const OverlayContent = (
    <Box.Stack css={styles.overlay} justify="center" align="center">
      {overlayContent}
    </Box.Stack>
  );

  if (isLoading) {
    return (
      <Box
        css={{ ...styles.root, justifyContent: 'center', alignItems: 'center' }}
      >
        <Spinner size={20} color="intentsBase4" />
      </Box>
    );
  }
  return (
    <Box.Stack gap="$4" css={{ mt: '$8' }}>
      {errorMsg && (
        <Alert css={styles.alert} status="error">
          <Alert.Description>{capitalize(errorMsg)}</Alert.Description>
        </Alert>
      )}
      <Box css={styles.root}>
        <Heading as="h6">
          Check if it's working
          {showNotDetectedOverlay && notDetected && !error && (
            <Tooltip content={downloadContent} side="left">
              <Tag
                size="xs"
                intent="warning"
                variant="ghost"
                leftIcon="AlertTriangle"
              >
                Not working
              </Tag>
            </Tooltip>
          )}
          {error && !notDetected && (
            <Tag size="xs" intent="error" variant="ghost" leftIcon="X">
              Failed
            </Tag>
          )}
          {!notDetected && !error && (
            <Tag size="xs" intent="primary" variant="ghost">
              Wallet Detected
            </Tag>
          )}
        </Heading>
        {shouldShowRawError && (
          <Input css={{ width: '100%', height: 200 }}>
            <Input.Field
              as="textarea"
              value={error.message}
              css={{ color: '$intentsError10', padding: '$2', height: '$full' }}
            />
          </Input>
        )}
        {children}
        {showNotDetectedOverlay && notDetected && NotDetectedOverlayDefault}
        {overlayContent && OverlayContent}
      </Box>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    padding: '$4',
    borderRadius: '$md',
    border: '1px solid $border',
    position: 'relative',
    overflow: 'hidden',

    h6: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '$0',
      color: '$intentsBase10',
      gap: '$2',

      '& .fuel_Icon': {
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
