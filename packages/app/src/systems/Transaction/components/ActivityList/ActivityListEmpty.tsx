import { Button, Icon } from '@fuel-wallet/ui';
import { EmptyList } from '~/systems/Core';
import { useFundWallet } from '~/systems/FundWallet';

export function ActivityListEmpty() {
  const { open, showFund, hasFaucet } = useFundWallet();
  return (
    <EmptyList
      label="No activity yet"
      description="When you make a transaction you'll see it here"
    >
      {showFund && (
        <Button
          size="sm"
          intent="primary"
          leftIcon={hasFaucet ? Icon.is('Wand') : Icon.is('BuildingBridge')}
          onPress={open}
        >
          {hasFaucet ? 'Faucet' : 'Bridge to Fuel'}
        </Button>
      )}
    </EmptyList>
  );
}
