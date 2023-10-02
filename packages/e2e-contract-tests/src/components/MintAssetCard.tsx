import { Card, Button, InputAmount } from '@fuel-ui/react';
import { useAccount, useWallet } from '@fuel-wallet/react';
import { BN, bn } from 'fuels';

import { mint } from '../contract_interactions';
import { useState } from 'react';

export const MintAssetCard = () => {
  const [amount, setAmount] = useState<BN | null>(bn());
  const account = useAccount();
  const wallet = useWallet({ address: account.account });

  return (
    <Card>
      <Card.Header>Mint Custom Asset</Card.Header>
      <Card.Body aria-label="Mint asset card">
        <InputAmount hiddenBalance onChange={setAmount} value={amount} />
        <Button
          isDisabled={!wallet.wallet}
          onPress={async () => {
            if (wallet.wallet && amount) {
              await mint({ wallet: wallet.wallet, amount });
            }
          }}
          css={{ width: '$full', marginTop: '10px' }}
        >
          Mint
        </Button>
      </Card.Body>
    </Card>
  );
};
