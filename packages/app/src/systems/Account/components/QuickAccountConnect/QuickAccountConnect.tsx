import { cssObj } from '@fuel-ui/css';
import { Box, ContentLoader, Tooltip } from '@fuel-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentTab } from '~/systems/CRX/hooks/useCurrentTab';
import { Pages } from '~/systems/Core';
import { useConnection } from '~/systems/DApp/hooks/useConnection';
import { useCurrentAccount } from '../../hooks/useCurrentAccount';
import { DappAvatar } from './DappAvatar';

enum ConnectionStatus {
  CurrentAccount = 'CURRENT_ACCOUNT',
  OtherAccount = 'OTHER_ACCOUNT',
  NoAccounts = 'NO_ACCOUNTS',
}

export const QuickAccountConnect = () => {
  const navigate = useNavigate();

  const { account } = useCurrentAccount();
  const { currentTab } = useCurrentTab();
  const { connection } = useConnection({ url: currentTab?.url });

  const status = useMemo<ConnectionStatus>(() => {
    if (!account || !connection) {
      return ConnectionStatus.NoAccounts;
    }

    if (connection.accounts.includes(account.address)) {
      return ConnectionStatus.CurrentAccount;
    }

    return ConnectionStatus.OtherAccount;
  }, [account, connection]);

  const tooltip = useMemo<string>(() => {
    if (status === ConnectionStatus.CurrentAccount) {
      return `${account?.name} connected`;
    }

    if (status === ConnectionStatus.OtherAccount) {
      return `${account?.name} not connected`;
    }

    return 'No accounts connected';
  }, [status, account]);

  if (!account) {
    return (
      <ContentLoader width={22} height={22} viewBox="0 0 22 22">
        <circle cx="11" cy="11" r="11" />
      </ContentLoader>
    );
  }

  return (
    <Tooltip delayDuration={0} content={tooltip}>
      <Box
        css={styles.root}
        data-has-connection={!!connection}
        onClick={() => {
          if (!connection) return;
          navigate(
            Pages.settingsConnectedApps(undefined, {
              origin: connection?.origin,
              forceBackPagination: true,
            })
          );
        }}
      >
        <Box css={styles.favicon}>
          <DappAvatar
            favIconUrl={connection?.favIconUrl || currentTab?.faviconUrl}
            title={connection?.title || currentTab?.title}
          />
        </Box>

        <Box css={styles.badge} data-status={status}>
          <Box css={styles.circle} data-status={status} />
        </Box>
      </Box>
    </Tooltip>
  );
};

const styles = {
  root: cssObj({
    position: 'relative',
    display: 'inline-block',
    width: 24,
    height: 24,

    '&[data-has-connection="true"]': {
      cursor: 'pointer',
    },
    '&[data-has-connection="false"]': {
      cursor: 'default',
    },
  }),
  favicon: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',

    fontSize: '$xs',
    backgroundColor: '$intentsBase6',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',

    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: '$full',

    img: {
      width: '100%',
      objectFit: 'cover',
    },
  }),
  badge: cssObj({
    position: 'absolute',
    zIndex: 1,

    [`&[data-status="${ConnectionStatus.CurrentAccount}"]`]: {
      bottom: -1,
      right: -4,
    },
    [`&[data-status="${ConnectionStatus.OtherAccount}"]`]: {
      bottom: 1,
      right: -2,
    },
    [`&[data-status="${ConnectionStatus.NoAccounts}"]`]: {
      bottom: -1,
      right: -4,
    },
  }),
  circle: cssObj({
    boxSizing: 'border-box',
    borderRadius: '$full',
    borderStyle: 'solid',

    [`&[data-status="${ConnectionStatus.CurrentAccount}"]`]: {
      height: 12,
      width: 12,
      borderWidth: 3,
      borderColor: '$bodyColor',
      backgroundColor: '$intentsPrimary11',
    },
    [`&[data-status="${ConnectionStatus.OtherAccount}"]`]: {
      width: 8,
      height: 8,
      backgroundColor: '$bodyColor',
      borderWidth: 2,
      borderColor: '$intentsPrimary11',
    },
    [`&[data-status="${ConnectionStatus.OtherAccount}"]:after`]: {
      content: '',
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      zIndex: -1,
      borderRadius: '$full',
      backgroundColor: '$bodyColor',
    },
    [`&[data-status="${ConnectionStatus.NoAccounts}"]`]: {
      height: 12,
      width: 12,
      backgroundColor: '$intentsBase11',
      borderWidth: 3,
      borderColor: '$bodyColor',
    },
  }),
};
