import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Button, Heading, Icon, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { ReactNode } from 'react';

import { useAccounts } from '../../hooks';

import { BalanceWidgetLoader } from './BalanceWidgetLoader';

import { FuelAddress } from '~/systems/Account';
import type { Maybe } from '~/systems/Core';
import { AmountVisibility, VisibilityButton } from '~/systems/Core';

type BalanceWidgetWrapperProps = {
  children: ReactNode;
};

export function BalanceWidgetWrapper({ children }: BalanceWidgetWrapperProps) {
  return <Box css={styles.balanceWidgetWrapper}>{children}</Box>;
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
    <BalanceWidgetWrapper>
      <Box.Flex justify="space-between">
        <Box.Flex css={styles.accountInfo}>
          <Avatar.Generated
            size="sm"
            hash={account?.address as string}
            css={{ boxShadow: '$sm' }}
          />
          <Box.Stack gap="$1">
            <Heading as="h6" css={styles.name}>
              {account.name}
            </Heading>
            <FuelAddress
              address={account.address}
              css={styles.balanceAddress}
            />
          </Box.Stack>
        </Box.Flex>
        <Button
          size="xs"
          variant="link"
          rightIcon={<Icon icon="ChevronDown" color="intentsBase8" />}
          aria-label="Accounts"
          onPress={handlers.goToList}
          css={styles.visibilityToggle}
        >
          Change
        </Button>
      </Box.Flex>
      <Box.Flex gap="$2">
        <Text
          css={styles.balance}
          aria-hidden={visibility}
          data-account-name={account.name}
        >
          {account.balanceSymbol || '$'}&nbsp;
          <AmountVisibility value={account.balance} visibility={visibility} />
        </Text>
        <VisibilityButton
          aria-label={visibility ? 'Hide balance' : 'Show balance'}
          visibility={visibility}
          onChangeVisibility={onChangeVisibility}
        />
      </Box.Flex>
    </BalanceWidgetWrapper>
  );
}

BalanceWidget.Loader = BalanceWidgetLoader;

const styles = {
  balanceAddress: cssObj({
    color: '$intentsBase11',
    fontSize: '$sm',
  }),
  balance: cssObj({
    fontSize: '1.625rem',

    '&[aria-hidden="true"]': {
      color: '$intentsBase12',
    },
    '&[aria-hidden="false"]': {
      color: '$intentsBase10',
    },
  }),
  balanceWidgetWrapper: cssObj({
    display: 'flex',
    layer: 'layer-card',
    flexDirection: 'column',
    borderRadius: '$default',
    gap: '$2',
    px: '$4',
    py: '$3',
  }),
  visibilityToggle: cssObj({
    height: '20px !important',
    padding: '$0 2px',
    borderRadius: 8,
  }),
  name: cssObj({
    lineHeight: '$tight',
    margin: '0px 0px -6px',
  }),
  accountInfo: cssObj({
    gap: '$3',
    alignItems: 'center',
  }),
};
