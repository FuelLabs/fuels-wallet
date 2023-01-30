import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Box,
  Copyable,
  Flex,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { ReactNode } from 'react';

import { BalanceWidgetLoader } from './BalanceWidgetLoader';

import type { Maybe } from '~/systems/Core';
import {
  shortAddress,
  VisibilityButton,
  AmountVisibility,
} from '~/systems/Core';

type BalanceWidgetWrapperProps = {
  children: ReactNode;
};

export function BalanceWidgetWrapper({ children }: BalanceWidgetWrapperProps) {
  return (
    <Box css={styles.balanceWidgetWrapper}>
      <Box css={styles.backgroundShadow}>&nbsp;</Box>
      <Box css={styles.backgroundFront}>&nbsp;</Box>
      <Flex css={styles.contentWrapper}>{children}</Flex>
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
  onPressAccounts,
  onChangeVisibility,
}: BalanceWidgetProps) {
  if (isLoading || !account) return <BalanceWidget.Loader />;

  return (
    <BalanceWidgetWrapper>
      <Flex direction="column" align="center">
        <Avatar.Generated size="lg" hash={account.address} background="fuel" />
        <IconButton
          size="xs"
          variant="ghost"
          color="gray"
          icon={<Icon icon="CaretDown" color="gray8" />}
          aria-label="Accounts"
          onPress={onPressAccounts}
          css={styles.caretDownIcon}
        />
      </Flex>
      <Flex justify="space-between" css={styles.balanceDetails}>
        <Flex direction="column" css={styles.balanceContainer}>
          <Copyable value={account.address}>
            <Text
              fontSize="sm"
              color="gray11"
              css={styles.balanceAddress}
              aria-label={account.address}
              data-account-name={account.name}
            >
              {shortAddress(account.address)}
            </Text>
          </Copyable>
          <Text fontSize="2xl" css={styles.balance} aria-hidden={visibility}>
            {account.balanceSymbol || '$'}&nbsp;
            <AmountVisibility value={account.balance} visibility={visibility} />
          </Text>
        </Flex>
        <Box css={styles.visibilityContainer}>
          <VisibilityButton
            aria-label={visibility ? 'Hide balance' : 'Show balance'}
            visibility={visibility}
            onChangeVisibility={onChangeVisibility}
          />
        </Box>
      </Flex>
    </BalanceWidgetWrapper>
  );
}

BalanceWidget.Loader = BalanceWidgetLoader;

const backgroundCss = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  boxShadow: '2px 0px 4px rgba(0, 0, 0, 0.15)',
  transform: 'skew(-25deg)',
  borderTopRightRadius: '40px 35px',
  borderBottomRightRadius: '35px 25px',
  borderBottomLeftRadius: '40px 50px',
  borderTopLeftRadius: '10px',
};

const styles = {
  balanceDetails: cssObj({ flex: '1 0' }),
  balanceAddress: cssObj({
    fontWeight: 'bold',
  }),
  visibilityContainer: cssObj({ marginRight: 6, marginTop: 8 }),
  balanceContainer: cssObj({ mt: '$2', ml: '$4', alignSelf: 'center' }),
  balance: cssObj({
    '&[aria-hidden="true"]': {
      color: '$gray12',
    },
    '&[aria-hidden="false"]': {
      color: '$gray10',
    },
    fontWeight: 'bold',
  }),
  backgroundFront: cssObj({
    ...backgroundCss,
    background:
      'linear-gradient(180deg, #1F1F1F 0%, rgba(28, 30, 31, 0.45) 41.15%)',
    top: 3,
    left: 3,
  }),
  backgroundShadow: cssObj({
    ...backgroundCss,
    background:
      'linear-gradient(180deg, #0F0F0F -9.3%, rgba(18, 20, 20, 0.45) 35.67%)',
    top: 10,
    left: 7,
  }),
  contentWrapper: cssObj({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  }),
  balanceWidgetWrapper: cssObj({
    minHeight: 88,
    position: 'relative',
  }),
  caretDownIcon: cssObj({
    marginTop: 8,
    height: '20px !important',
    padding: '0 3px !important',
    borderRadius: 8,
  }),
};
