import { cssObj } from '@fuel-ui/css';
import { Box, Link, Spinner, Tag, Tooltip } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { Heading } from './Heading';

import { useFuelWeb3 } from '~/src/hooks/useFuelWeb3';

export function ExampleBox({
  children,
  error,
}: {
  children: ReactNode;
  error?: string | null;
}) {
  const [, notDetected, isLoading] = useFuelWeb3();
  const downloadContent = (
    <>
      {error}{' '}
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
    <Box css={styles.root}>
      <Heading as="h6">
        Check it working{' '}
        {error ? (
          <Tooltip content={downloadContent} side="left">
            <Tag size="xs" color="amber" variant="ghost" leftIcon="Warning">
              Not working
            </Tag>
          </Tooltip>
        ) : (
          <Tag size="xs" color="accent" variant="ghost">
            Wallet Detected
          </Tag>
        )}
      </Heading>
      {children}
    </Box>
  );
}

const styles = {
  root: cssObj({
    mt: '$8',
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
        color: '$amber9',
      },
    },
  }),
};
