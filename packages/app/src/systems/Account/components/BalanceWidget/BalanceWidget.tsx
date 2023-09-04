import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Button, Heading, Icon, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { ReactNode } from 'react';
import { FuelAddress } from '~/systems/Account';
import type { Maybe } from '~/systems/Core';
import { AmountVisibility, VisibilityButton } from '~/systems/Core';

import { useAccounts } from '../../hooks';

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
  account?: Maybe<Account>;
  isLoading?: boolean;
  visibility?: boolean;
  onPressAccounts?: () => void;
  onChangeVisibility?: (visibility: boolean) => void;
};

export function BalanceWidget({
  account,
  isLoading,
  visibility = true,
  onChangeVisibility,
}: BalanceWidgetProps) {
  const { handlers } = useAccounts();
  if (isLoading || !account) return <BalanceWidget.Loader />;

  return (
    <BalanceWidgetWrapper
      top={
        <>
          <Avatar.Generated
            size="sm"
            hash={account?.address as string}
            css={{ boxShadow: '$sm' }}
          />
          <Box.Stack gap="$1" css={{ flex: 1 }}>
            <Heading as="h6" css={styles.name}>
              {account.name}
            </Heading>
            <FuelAddress
              address={account.address}
              css={styles.balanceAddress}
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
          <Text className="label">Balance</Text>
          <Box.Flex>
            <Text aria-hidden={visibility} data-account-name={account.name}>
              {account.balanceSymbol || '$'}&nbsp;
              <AmountVisibility
                value={account.balance}
                visibility={visibility}
              />
            </Text>
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
    pb: '$3',
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
    },
    '.label': {
      lineHeight: '$tight',
    },
  }),
  name: cssObj({
    lineHeight: '$tight',
    margin: '0px 0px -6px',
  }),
  accountInfo: cssObj({
    gap: '$3',
    alignItems: 'center',
    py: '$4',
    px: '$4',
    borderTop: '1px solid $border',
    borderBottom: '1px solid $border',
  }),
  accountChange: cssObj({
    borderColor: '$border',
  }),
};
