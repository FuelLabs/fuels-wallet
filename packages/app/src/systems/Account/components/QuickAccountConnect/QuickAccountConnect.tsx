import { cssObj } from '@fuel-ui/css';
import { Box, Tooltip } from '@fuel-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentTab } from '~/systems/CRX/hooks/useCurrentTab';
import { Pages } from '~/systems/Core';
import { useConnection } from '~/systems/DApp/hooks/useConnection';
import { useCurrentAccount } from '../../hooks/useCurrentAccount';

enum ConnectionStatus {
  CurrentAccount = 'CURRENT_ACCOUNT',
  OtherAccount = 'OTHER_ACCOUNT',
  NoAccounts = 'NO_ACCOUNTS',
}

export const QuickAccountConnect = () => {
  const navigate = useNavigate();

  const { account } = useCurrentAccount();
  const { url, faviconUrl } = useCurrentTab();
  const { connection } = useConnection({ url });

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

  if (!origin) {
    return null;
  }

  return (
    <Tooltip delayDuration={0} content={tooltip}>
      <Box
        css={styles.root}
        onClick={() => {
          navigate(
            Pages.settingsConnectedApps(undefined, {
              origin: connection?.origin,
              forceBackPagination: true,
            })
          );
        }}
      >
        <Box css={styles.favicon}>
          {faviconUrl && <img src={faviconUrl} alt="favicon" />}
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
    cursor: 'pointer',
    width: 24,
    height: 24,
  }),
  favicon: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',

    backgroundColor: '$cardBg',
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
