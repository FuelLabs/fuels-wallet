import { cssObj } from '@fuel-ui/css';
import { Button, Flex, Input, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';

import { AmountInputLoader } from './AmountInputLoader';

export type AmountInputProps = {
  asset: {
    amount: BN;
    assetId: string;
  };
};

type AmountInputComponent = FC<AmountInputProps> & {
  Loader: typeof AmountInputLoader;
};

export const AmountInput: AmountInputComponent = ({ asset }) => {
  const [assetAmount, setAssetAmount] = useState<string>();
  const formatArgs = {
    minPrecision: 2,
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newAssetAmount = handleAmountLeadingZeros(event);
    setAssetAmount(newAssetAmount);
  };

  const handlePress = () => {
    setAssetAmount(asset.amount.format(formatArgs));
  };

  const handleAmountLeadingZeros = (
    event: ChangeEvent<HTMLInputElement>
  ): string => {
    const valueWithoutLeadingZeros = event.target.value.replace(
      /^0\d/,
      (substring) => substring.replace(/^0+(?=[\d])/, '')
    );
    return valueWithoutLeadingZeros.startsWith('.')
      ? `0${valueWithoutLeadingZeros}`
      : valueWithoutLeadingZeros;
  };

  return (
    <Input size="lg" css={styles.input}>
      <Input.Number
        autoComplete="off"
        inputMode="decimal"
        name="amount"
        placeholder="0.00"
        allowedDecimalSeparators={['.', ',']}
        allowNegative={false}
        thousandSeparator={false}
        value={assetAmount}
        onChange={handleAmountChange}
      />
      <Input.ElementRight>
        <Flex direction="column" align="end" basis="auto">
          <Button
            aria-label="Max"
            size="xs"
            variant="ghost"
            css={styles.button}
            onPress={handlePress}
          >
            Max
          </Button>
          <Text css={styles.text}>
            Balance: {asset.amount.format(formatArgs)}
          </Text>
        </Flex>
      </Input.ElementRight>
    </Input>
  );
};

AmountInput.Loader = AmountInputLoader;

const styles = {
  input: cssObj({
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
  }),
  button: cssObj({
    width: '50%',
  }),
  text: cssObj({
    fontSize: '$xs',
    whiteSpace: 'nowrap',
  }),
};
