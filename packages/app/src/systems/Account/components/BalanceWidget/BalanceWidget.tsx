import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Heading, Icon, IconButton, Text } from '@fuel-ui/react';
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
  return (
    <Box css={styles.balanceWidgetWrapper}>
      <Box css={styles.backgroundShadow}>&nbsp;</Box>
      <Box css={styles.backgroundFront}>&nbsp;</Box>
      <Box.Flex css={styles.contentWrapper}>{children}</Box.Flex>
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
    <BalanceWidgetWrapper>
      <Box.Flex direction="column" align="center">
        <Avatar.Generated
          size="lg"
          hash={account.address}
          css={{ boxShadow: '$sm' }}
        />
        <IconButton
          size="xs"
          variant="ghost"
          color="intentsBase"
          icon={<Icon icon="ChevronDown" color="intentsBase8" />}
          aria-label="Accounts"
          onPress={handlers.goToList}
          css={styles.ChevronDownIcon}
        />
      </Box.Flex>
      <Box.Flex justify="space-between" css={styles.balanceDetails}>
        <Box.Flex direction="column" css={styles.balanceContainer}>
          <Heading as="h6" css={styles.name}>
            {account.name}
          </Heading>
          <FuelAddress address={account.address} css={styles.balanceAddress} />
          <Text
            css={styles.balance}
            aria-hidden={visibility}
            data-account-name={account.name}
          >
            {account.balanceSymbol || '$'}&nbsp;
            <AmountVisibility value={account.balance} visibility={visibility} />
          </Text>
        </Box.Flex>
        <Box css={styles.visibilityContainer}>
          <VisibilityButton
            aria-label={visibility ? 'Hide balance' : 'Show balance'}
            visibility={visibility}
            onChangeVisibility={onChangeVisibility}
          />
        </Box>
      </Box.Flex>
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
    color: '$intentsBase11',
    fontSize: '$xs',
    fontWeight: 'bold',
  }),
  visibilityContainer: cssObj({
    marginRight: 6,
    marginTop: 8,
    svg: {
      height: 18,
      width: 18,
    },
  }),
  balanceContainer: cssObj({ mt: '$1', ml: '$4', alignSelf: 'center' }),
  balance: cssObj({
    fontSize: '1.625rem',
    fontWeight: 'bold',
    margin: '$2 0',
    '&[aria-hidden="true"]': {
      color: '$intentsBase12',
    },
    '&[aria-hidden="false"]': {
      color: '$intentsBase10',
    },
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
    minHeight: 97,
    position: 'relative',
  }),
  ChevronDownIcon: cssObj({
    marginTop: 8,
    height: '20px !important',
    padding: '0 3px !important',
    borderRadius: 8,
  }),
  name: cssObj({
    fontSize: '$sm',
    margin: '0px 0px -6px',
  }),
};
