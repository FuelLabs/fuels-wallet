import { cssObj } from '@fuel-ui/css';
import { Box, Button, Card, Heading, Icon, Text } from '@fuel-ui/react';
import { BALANCE_NFTS_TAB_HEIGHT } from '~/systems/Account/components/BalanceNFTs/constants';
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
    <Box css={styles.container}>
      <Card css={styles.empty}>
        <Card.Body>
          {!!text && <Heading as="h5">{text}</Heading>}
          {!!supportText && <Text fontSize="sm">{supportText}</Text>}
          {showFund && !hideFaucet && (
            /**
             * TODO: need to add right faucet icon on @fuel-ui
             */
            <Button
              size="sm"
              intent="primary"
              leftIcon={hasFaucet ? Icon.is('Wand') : Icon.is('Coins')}
              onPress={open}
            >
              {hasFaucet ? 'Faucet' : 'Bridge to Fuel'}
            </Button>
          )}
        </Card.Body>
      </Card>
    </Box>
  );
}

const styles = {
  container: cssObj({
    minHeight: BALANCE_NFTS_TAB_HEIGHT,
  }),
  empty: cssObj({
    h5: {
      margin: 0,
    },
    button: {
      mt: '$4',
    },
  }),
};
