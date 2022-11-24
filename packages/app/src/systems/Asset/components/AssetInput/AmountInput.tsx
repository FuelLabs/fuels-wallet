import { cssObj } from '@fuel-ui/css';
import { Button, Flex, Input, Text } from '@fuel-ui/react';
import { DECIMAL_UNITS } from 'fuels';
import type { BN } from 'fuels';
import { useEffect, useState } from 'react';
import type { FC } from 'react';

import { AmountInputLoader } from './AmountInputLoader';
import { createAmount } from './utils';

export type AmountInputProps = {
  name?: string;
  balance: BN;
  value: BN;
  onChange: (val: BN) => void;
};

type AmountInputComponent = FC<AmountInputProps> & {
  Loader: typeof AmountInputLoader;
};

export const AmountInput: AmountInputComponent = ({
  name,
  balance,
  value,
  onChange,
}) => {
  const [assetAmount, setAssetAmount] = useState<string>(
    value.eq(0) ? '' : value.formatUnits(DECIMAL_UNITS)
  );

  useEffect(() => {
    handleAmountChange(value.formatUnits(DECIMAL_UNITS));
  }, [value.toString()]);

  const handleAmountChange = (text: string) => {
    const { text: newText, amount } = createAmount(text);
    const { amount: currentAmount } = createAmount(assetAmount);
    if (!currentAmount.eq(amount)) {
      onChange(amount);
      setAssetAmount(newText);
    }
  };

  const handleSetBalance = () => {
    handleAmountChange(balance.formatUnits(DECIMAL_UNITS));
  };

  return (
    <Input size="lg" css={styles.input}>
      <Input.Number
        autoComplete="off"
        inputMode="decimal"
        name={name}
        placeholder="0.00"
        allowedDecimalSeparators={['.', ',']}
        allowNegative={false}
        thousandSeparator={false}
        value={assetAmount}
        onChange={(e) => handleAmountChange(e.target.value)}
        decimalScale={DECIMAL_UNITS}
      />
      <Input.ElementRight>
        <Flex direction="column" align="end" css={styles.flexColumn}>
          <Flex>
            <Button
              aria-label="Max"
              size="xs"
              variant="ghost"
              onPress={handleSetBalance}
              css={styles.button}
            >
              Max
            </Button>
          </Flex>
          <Flex>
            <Text css={styles.text}>
              Balance: {balance.format({ precision: DECIMAL_UNITS })}
            </Text>
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
