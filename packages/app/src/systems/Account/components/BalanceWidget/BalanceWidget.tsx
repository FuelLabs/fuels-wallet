import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Box,
  Button,
  Heading,
  Icon,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import type { AccountWithBalance } from '@fuel-wallet/types';
import { type ReactNode, useMemo } from 'react';
import { FuelAddress } from '~/systems/Account';
import { VisibilityButton, formatBalance } from '~/systems/Core';

import { useAccounts } from '../../hooks';

import { DEFAULT_DECIMAL_UNITS } from 'fuels';
import { INTL_FORMATTER } from '~/systems/Asset/constants';
import { BalanceWidgetLoader } from './BalanceWidgetLoader';

type BalanceWidgetWrapperProps = {
  top: ReactNode;
  bottom: ReactNode;
};

export function BalanceWidgetWrapper({
  top,
  bottom,
}: BalanceWidgetWrapperProps) {
  return (
    <Box css={styles.balanceWidgetWrapper}>
      <Box.Flex css={styles.accountInfo}>{top}</Box.Flex>
      <Box.Stack css={styles.balance}>{bottom}</Box.Stack>
    </Box>
  );
}

export type BalanceWidgetProps = {
  account?: AccountWithBalance;
  isLoading?: boolean;
  visibility?: boolean;
  onPressAccounts?: () => void;
  onChangeVisibility?: (visibility: boolean) => void;
};

const decimals = DEFAULT_DECIMAL_UNITS;

export function BalanceWidget({
  account,
  isLoading,
  visibility = true,
  onChangeVisibility,
}: BalanceWidgetProps) {
  const { handlers } = useAccounts();
  const totalBalanceInUsd = account?.totalBalanceInUsd ?? 0;
  const { tooltip } = useMemo(() => {
    return formatBalance(account?.balance, decimals);
  }, [account]);

  if (isLoading || !account) return <BalanceWidget.Loader />;

  const totalValue = INTL_FORMATTER.format(totalBalanceInUsd);

  return (
    <BalanceWidgetWrapper
      top={
        <>
          <Avatar.Generated
            size="sm"
            hash={account?.address as string}
            css={{ boxShadow: '$sm' }}
          />
          <Box.Stack gap="$1" css={{ flex: 1, minWidth: 0 }}>
            <Heading
              as="h6"
              css={styles.name}
              aria-label={`${account.name} selected`}
            >
              {account.name}
            </Heading>
            <FuelAddress
              address={account.address}
              css={styles.balanceAddress}
              canOpenExplorer
            />
          </Box.Stack>
          <Button
            size="sm"
            variant="outlined"
            css={styles.accountChange}
            rightIcon={<Icon icon="ChevronDown" color="intentsBase8" />}
            aria-label="Accounts"
            onPress={handlers.goToList}
          >
            Change
          </Button>
        </>
      }
      bottom={
        <>
          <Text className="label">Total balance</Text>
          <Box.Flex>
            <Tooltip
              content={`$${totalBalanceInUsd}`}
              delayDuration={0}
              open={visibility && tooltip ? undefined : false}
            >
              <Text
                aria-hidden={visibility}
                aria-label="Total balance in USD"
                data-account-name={account.name}
                className="value"
              >
                {visibility ? totalValue : '$•••••'}
              </Text>
            </Tooltip>
            <VisibilityButton
              aria-label={visibility ? 'Hide balance' : 'Show balance'}
              visibility={visibility}
              onChangeVisibility={onChangeVisibility}
            />
          </Box.Flex>
        </>
      }
    />
  );
}

BalanceWidget.Loader = BalanceWidgetLoader;

const styles = {
  balanceWidgetWrapper: cssObj({
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '$default',
  }),
  balanceAddress: cssObj({
    color: '$intentsBase11',
    fontSize: '$sm',
  }),
  balance: cssObj({
    pt: '$3',
    px: '$4',

    '&[aria-hidden="true"]': {
      color: '$intentsBase12',
    },
    '&[aria-hidden="false"]': {
      color: '$intentsBase10',
    },
    '.fuel_Text[data-account-name]': {
      color: '$textInverse',
      fontSize: '$3xl',
      fontFamily: '$mono',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: 'normal',
    },
    '.label': {
      lineHeight: '$tight',
      fontSize: '$sm',
      fontWeight: '$medium',
    },
    '.value': {
      fontSize: 32,
      fontFamily: '$mono',
      fontWeight: '$bold',
      lineHeight: '36px',
    },
  }),
  name: cssObj({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineHeight: '$tight',
    margin: '0px 0px -6px',
  }),
  accountInfo: cssObj({
    gap: '$3',
    alignItems: 'center',
    py: '$4',
    px: '$4',
    borderBottom: '1px solid $border',
  }),
  accountChange: cssObj({
    borderColor: '$border',
  }),
};
