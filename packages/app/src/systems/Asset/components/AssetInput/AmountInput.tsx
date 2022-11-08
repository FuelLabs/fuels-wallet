import { cssObj } from '@fuel-ui/css';
import { Button, Flex, Input, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';

import { AmountInputLoader } from './AmountInputLoader';

export type AmountInputProps = {
  amount: BN;
};

type AmountInputComponent = FC<AmountInputProps> & {
  Loader: typeof AmountInputLoader;
};

export const AmountInput: AmountInputComponent = ({ amount }) => {
  const [assetAmount, setAssetAmount] = useState<string>();

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newAssetAmount = handleAmountLeadingZeros(event);
    setAssetAmount(newAssetAmount);
  };

  const handlePress = () => {
    setAssetAmount(amount.format());
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
        <Flex direction="column" align="end" css={styles.flexColumn}>
          <Flex>
            <Button
              aria-label="Max"
              size="xs"
              variant="ghost"
              onPress={handlePress}
              css={styles.button}
            >
              Max
            </Button>
          </Flex>
          <Flex>
            <Text css={styles.text}>Balance: {amount.format()}</Text>
          </Flex>
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
    marginTop: '$2',
    marginBottom: '$1',
    height: '$5 !important',
  }),
  flexColumn: cssObj({
    marginRight: '$1',
  }),
  text: cssObj({
    fontSize: '$xs',
    whiteSpace: 'nowrap',
    marginBottom: '$2',
  }),
};
