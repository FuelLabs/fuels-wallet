import { cssObj, Box, Button, Icon } from '@fuel-wallet/ui';
import { BALANCE_NFTS_TAB_HEIGHT } from '~/systems/Account/components/BalanceNFTs/constants';
import { EmptyList } from '~/systems/Core/components/EmptyList/EmptyList';
import { useFundWallet } from '~/systems/FundWallet';

export type AssetListEmptyProps = {
  text?: string;
  supportText?: string;
  hideFaucet?: boolean;
};

export function AssetListEmpty({
  text = `You don't have any assets`,
  supportText = 'Start depositing some assets',
  hideFaucet = false,
}: AssetListEmptyProps) {
  const { open, hasFaucet, hasBridge } = useFundWallet();
  const showFund = hasFaucet || hasBridge;

  return (
    <Box.Stack css={styles.container}>
      <EmptyList compact label={text} description={supportText || undefined}>
        {showFund && !hideFaucet && (
          <Button
            size="sm"
            intent="primary"
            leftIcon={hasFaucet ? Icon.is('Wand') : Icon.is('Coins')}
            onPress={open}
          >
            {hasFaucet ? 'Faucet' : 'Bridge to Fuel'}
          </Button>
        )}
      </EmptyList>
    </Box.Stack>
  );
}

const styles = {
  container: cssObj({
    minHeight: BALANCE_NFTS_TAB_HEIGHT,
    py: '$4',
  }),
};
