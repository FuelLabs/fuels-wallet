import { Card, Button } from '@fuel-ui/react';
import { useAccount, useWallet } from '@fuel-wallet/react';
import { bn } from 'fuels';

import { mint } from '../contract_interactions';

export const MintAssetCard = () => {
  const account = useAccount();
  const wallet = useWallet({ address: account.account });

  return (
    <Card>
      <Card.Header>Mint Custom Asset</Card.Header>
      <Card.Body>
        <Button
          isDisabled={!wallet.wallet}
          onPress={async () => {
            if (wallet.wallet) {
              await mint({ wallet: wallet.wallet, amount: bn(100) });
            }
          }}
          css={{ width: '$full' }}
        >
          Mint
        </Button>
      </Card.Body>
    </Card>
  );
};
