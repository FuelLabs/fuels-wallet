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
      <Box.Flex direction="column" align="center" justify="center">
        <Avatar.Generated size="lg" hash={account.address} />
        <IconButton
          size="xs"
          variant="outlined"
          icon={<Icon icon="ChevronDown" color="intentsBase8" />}
          aria-label="Accounts"
          onPress={handlers.goToList}
          css={styles.visibilityToggle}
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

const styles = {
  balanceDetails: cssObj({
    flex: '1 0',
  }),
  balanceAddress: cssObj({
    color: '$intentsBase11',
    fontSize: '$sm',
    fontWeight: 'bold',
  }),
  visibilityContainer: cssObj({
    marginTop: '$2',
    svg: {
      height: 18,
      width: 18,
    },
  }),
  balanceContainer: cssObj({
    mt: '$1',
    ml: '$4',
    alignSelf: 'center',
  }),
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
  balanceWidgetWrapper: cssObj({
    mt: '$1',
    layer: 'layer-card',
    padding: '$2 $3',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  }),
  visibilityToggle: cssObj({
    mt: '$2',
    height: '20px !important',
    padding: '$0 2px',
    borderRadius: 8,
  }),
  name: cssObj({
    margin: '0px 0px -6px',
  }),
};
