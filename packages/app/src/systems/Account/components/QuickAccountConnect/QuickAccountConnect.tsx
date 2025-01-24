import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Avatar,
  Box,
  Icon,
  IconButton,
  Text,
  VStack,
  toast,
} from '@fuel-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useCurrentTab } from '~/systems/CRX/hooks/useCurrentTab';
import { useConnection } from '~/systems/DApp/hooks/useConnection';
import { useOrigin } from '~/systems/DApp/hooks/useOrigin';
import { ConnectionService } from '~/systems/DApp/services';
import { useCurrentAccount } from '../../hooks/useCurrentAccount';

enum ConnectionStatus {
  CurrentAccount = 'CURRENT_ACCOUNT',
  OtherAccount = 'OTHER_ACCOUNT',
  NoAccounts = 'NO_ACCOUNTS',
}

export const getDismissKey = (account: string, origin: string) => {
  return `quick-account-connect-${account}-${origin}`;
};

export const QuickAccountConnect = () => {
  const { account } = useCurrentAccount();
  const { currentTab } = useCurrentTab();
  const origin = useOrigin({ url: currentTab?.url });
  const { connection, fetchConnection } = useConnection({
    origin: origin?.full,
  });

  const [dismissed, setDismissed] = useState(true);

  const status = useMemo<ConnectionStatus>(() => {
    if (!account || !connection) {
      return ConnectionStatus.NoAccounts;
    }

    if (connection.accounts.includes(account.address)) {
      return ConnectionStatus.CurrentAccount;
    }

    return ConnectionStatus.OtherAccount;
  }, [account, connection]);

  const onConnect = async () => {
    if (!origin || !account) return;
    await ConnectionService.addAccountTo({
      origin: origin.full,
      account: account.address,
    });
    await fetchConnection();
    toast.success(`${account?.name} connected`);
  };

  const onDismiss = () => {
    if (!origin || !account) return;
    setDismissed(true);
    localStorage.setItem(getDismissKey(account.address, origin.full), 'true');
  };

  useEffect(() => {
    if (!origin || !account) return;
    const hasDismissed = localStorage.getItem(
      getDismissKey(account.address, origin.full)
    );
    setDismissed(!!hasDismissed);
  }, [account, origin]);

  return (
    <Box
      css={styles.wrapper}
      data-open={status === ConnectionStatus.OtherAccount && !dismissed}
    >
      <Alert status="info" css={styles.alert}>
        <Alert.Description as="div">
          <Avatar.Generated
            size="sm"
            hash={account?.address as string}
            css={{ boxShadow: '$sm', flexShrink: 0 }}
          />

          <VStack gap="$1">
            <span>
              {account?.name || 'This account'} isn't connected to{' '}
              {origin?.short || 'this app'}
            </span>

            <Text color="scalesBlue10" css={styles.cta} onClick={onConnect}>
              Connect account
            </Text>
          </VStack>

          <IconButton
            icon={Icon.is('X')}
            aria-label="Close"
            variant="link"
            onPress={onDismiss}
          />
        </Alert.Description>
      </Alert>
    </Box>
  );
};

const styles = {
  wrapper: cssObj({
    position: 'fixed',
    paddingLeft: '$4',
    paddingRight: '15px',
    paddingBottom: '$4',
    bottom: 0,
    zIndex: '$10',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    pointerEvents: 'none',

    '&[data-open="true"]': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  }),
  alert: cssObj({
    '& .fuel_Alert-icon': {
      display: 'none',
    },
    '& .fuel_Alert-description': {
      display: 'flex',
      gap: '$2',
      alignItems: 'flex-start',
    },
  }),
  cta: cssObj({
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  }),
};
