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
import type { Account } from '@fuels-wallet/types';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { BalanceWidgetLoader } from './BalanceWidgetLoader';

import { formatUnits, shortAddress, VisibilityButton } from '~/systems/Core';

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
  account?: Account;
  isHidden?: boolean;
  isLoading?: boolean;
};

export function BalanceWidget({
  account,
  isHidden: _isHidden,
  isLoading,
}: BalanceWidgetProps) {
  const [isHidden, setIsHidden] = useState(_isHidden);

  useEffect(() => {
    setIsHidden(_isHidden);
  }, [_isHidden]);

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
          aria-label="Expand"
          css={styles.caretDownIcon}
        />
      </Flex>
      <Flex justify="space-between" css={{ flex: '1 0' }}>
        <Flex
          direction="column"
          css={{ mt: '$2', ml: '$4', alignSelf: 'center' }}
        >
          <Copyable value={account.address}>
            <Text fontSize="sm" color="gray11" css={{ fontWeight: 'bold' }}>
              {shortAddress(account.address)}
            </Text>
          </Copyable>
          <Text
            color={isHidden ? 'gray10' : 'gray12'}
            fontSize="2xl"
            css={{ fontWeight: 'bold' }}
          >
            <>
              {account.balanceSymbol || '$'}&nbsp;
              {isHidden ? '•••••' : formatUnits(account.balance)}
            </>
          </Text>
        </Flex>
        <Box css={{ marginRight: 6, marginTop: 8 }}>
          <VisibilityButton
            aria-label={isHidden ? 'Show balance' : 'Hide balance'}
            isHidden={isHidden}
            onHide={() => setIsHidden(true)}
            onShow={() => setIsHidden(false)}
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
