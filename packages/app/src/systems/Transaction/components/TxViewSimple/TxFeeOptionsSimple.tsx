import { cssObj } from '@fuel-ui/css';
import { Box, Button, HStack, Input, Text, VStack } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { DEFAULT_PRECISION } from 'fuels';
import { useState } from 'react';
import { createAmount } from '~/systems/Core/components/InputAmount/InputAmount';
import { isAmountAllowed } from '~/systems/Core/components/InputAmount/InputAmount.utils';

type TxFeeOptionsSimpleProps = {
  baseFee: BN;
  onBack: () => void;
  onTipChange?: (tip: BN) => void;
};

const DECIMAL_UNITS = 9;

export function TxFeeOptionsSimple({
  baseFee,
  onBack,
  onTipChange,
}: TxFeeOptionsSimpleProps) {
  const [customTip, setCustomTip] = useState('0');

  const handleTipChange = (text: string) => {
    setCustomTip(text);
    const { amount } = createAmount(text, DECIMAL_UNITS);
    onTipChange?.(amount);
  };

  const totalFee = createAmount(customTip, DECIMAL_UNITS).amount.add(baseFee);

  return (
    <Box css={styles.content}>
      <Box css={styles.card}>
        <HStack justify="space-between">
          <Text>Fee + Tip</Text>
          <Text>
            <Text as="span" color="gray8">
              {' '}
              ({totalFee.format({ minPrecision: DEFAULT_PRECISION })} ETH)
            </Text>
          </Text>
        </HStack>
      </Box>
      <HStack justify="between" gap="$4">
        <Box css={styles.inputBox}>
          <Text fontSize="xs">Gas limit</Text>
          <Input size="sm" isDisabled>
            <Input.Number
              value="51"
              inputMode="numeric"
              autoComplete="off"
              css={{ width: '100%' }}
            />
          </Input>
        </Box>
        <Box css={styles.inputBox}>
          <Text fontSize="xs">Tip</Text>
          <Input size="sm">
            <Input.Number
              value={customTip}
              inputMode="decimal"
              autoComplete="off"
              allowedDecimalSeparators={['.']}
              allowNegative={false}
              thousandSeparator={false}
              decimalScale={DECIMAL_UNITS}
              placeholder="0.00"
              css={{ width: '100%' }}
              isAllowed={isAmountAllowed}
              onChange={(e) => handleTipChange(e.target.value)}
            />
          </Input>
        </Box>
      </HStack>
      <Button size="xs" variant="link" onPress={onBack} css={styles.backButton}>
        Use regular options
      </Button>
    </Box>
  );
}

const styles = {
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    padding: '$3',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    color: '#202020',
  }),
  card: cssObj({
    padding: '$4',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '13px',
  }),
  inputBox: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  }),
  backButton: cssObj({
    alignSelf: 'center',
    color: '$accent11',
    fontSize: '12px',
    mt: '$2',
  }),
};
