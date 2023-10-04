import { Card, Button, InputAmount } from '@fuel-ui/react';
import { useAccount, useWallet } from '@fuel-wallet/react';
import type { BN } from 'fuels';
import { bn } from 'fuels';
import { useState } from 'react';

import { mint } from '../contract_interactions';

export const ForwardEthCard = () => {
  const [amount, setAmount] = useState<BN | null>(bn());
  const account = useAccount();
  const wallet = useWallet({ address: account.account });

  return (
    <Card>
      <Card.Header>Forward ETH</Card.Header>
      <Card.Body aria-label="forward eth card">
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
          Forward ETH
        </Button>
      </Card.Body>
    </Card>
  );
};
