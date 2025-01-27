import { cssObj } from '@fuel-ui/css';
import {
  Box,
  ContentLoader,
  RadioGroup,
  RadioGroupItem,
  Text,
} from '@fuel-ui/react';
import type { BN } from 'fuels';
import { DEFAULT_PRECISION, bn } from 'fuels';
import { useEffect, useState } from 'react';
import { formatAmount } from '~/systems/Core';
import { TxService } from '../../services';
import type { SimplifiedFee } from '../../types';

type TxFeeSimpleProps = {
  fee: SimplifiedFee;
  isLoading?: boolean;
};

type FeeOption = 'regular' | 'fast';

export function TxFeeSimple({ fee, isLoading }: TxFeeSimpleProps) {
  const [selectedOption, setSelectedOption] = useState<FeeOption>('regular');
  const [tips, setTips] = useState<{ regularTip: BN; fastTip: BN }>();

  useEffect(() => {
    async function getTips() {
      const { regularTip, fastTip } = await TxService.estimateDefaultTips();
      setTips({ regularTip, fastTip });
    }
    getTips();
  }, []);

  if (isLoading) return <TxFeeSimple.Loader />;

  const options = [
    {
      id: 'regular',
      name: 'Regular',
      fee: tips ? fee.network.add(tips.regularTip) : fee.network,
    },
    {
      id: 'fast',
      name: 'Fast',
      fee: tips ? fee.network.add(tips.fastTip) : fee.network,
    },
  ];

  return (
    <Box css={styles.content}>
      <Text css={styles.title}>Fee (network)</Text>
      <Box.Stack gap="$2">
        <RadioGroup>
          {options.map((option) => (
            <Box.Flex
              key={option.id}
              css={styles.option}
              onClick={() => setSelectedOption(option.id as FeeOption)}
            >
              <RadioGroupItem
                value={option.id}
                checked={selectedOption === option.id}
                label={option.name}
                labelCSS={styles.optionLabel}
                onChange={() => setSelectedOption(option.id as FeeOption)}
              />

              <Text css={styles.optionContent}>
                {option.fee
                  ? `${option.fee.format({
                      minPrecision: DEFAULT_PRECISION,
                      precision: DEFAULT_PRECISION,
                    })} ETH`
                  : '--'}
              </Text>
            </Box.Flex>
          ))}
        </RadioGroup>
      </Box.Stack>
    </Box>
  );
}

TxFeeSimple.Loader = function TxFeeSimpleLoader() {
  return (
    <Box css={styles.content}>
      <ContentLoader width={300} height={80} viewBox="0 0 300 80">
        <rect x="20" y="20" rx="4" ry="4" width="100" height="16" />
        <rect x="180" y="20" rx="4" ry="4" width="100" height="16" />
        <rect x="20" y="44" rx="4" ry="4" width="100" height="16" />
        <rect x="180" y="44" rx="4" ry="4" width="100" height="16" />
      </ContentLoader>
    </Box>
  );
};

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
  option: cssObj({
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    color: '#646464',
    cursor: 'pointer',
    fontSize: '13px',
    gap: '$3',
    justifyContent: 'space-between',
    padding: '$3',
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  }),
  optionContent: cssObj({
    color: '#202020',
  }),
  optionLabel: cssObj({
    color: '#202020',
    fontSize: '13px',
    fontWeight: '$medium',
  }),
  radio: cssObj({
    cursor: 'pointer',
    height: '16px',
    margin: 0,
    width: '16px',
  }),
};
