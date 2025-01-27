import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  ContentLoader,
  RadioGroup,
  RadioGroupItem,
  Text,
} from '@fuel-ui/react';
import type { BN } from 'fuels';
import { DEFAULT_PRECISION, bn } from 'fuels';
import { useEffect, useRef, useState } from 'react';
import { formatAmount } from '~/systems/Core';
import { TxService } from '../../services';
import type { SimplifiedFee } from '../../types';

type TxFeeSimpleProps = {
  fee: SimplifiedFee;
  isLoading?: boolean;
  onCustomFees?: () => void;
  onFeeSelect?: (tip: BN) => void;
};

type FeeOption = 'regular' | 'fast';

export function TxFeeSimple({
  fee,
  isLoading,
  onCustomFees,
  onFeeSelect,
}: TxFeeSimpleProps) {
  const [selectedOption, setSelectedOption] = useState<FeeOption>('regular');
  const [tips, setTips] = useState<{ regularTip: BN; fastTip: BN }>();
  const previousDefaultTip = useRef<BN>();

  useEffect(() => {
    async function getTips() {
      const { regularTip, fastTip } = await TxService.estimateDefaultTips();
      setTips({ regularTip, fastTip });
      // Set initial tip
      previousDefaultTip.current = regularTip;
      onFeeSelect?.(regularTip);
    }
    getTips();
  }, [onFeeSelect]);

  const handleOptionSelect = (option: FeeOption) => {
    setSelectedOption(option);
    if (!tips) return;

    const newTip = option === 'regular' ? tips.regularTip : tips.fastTip;
    previousDefaultTip.current = newTip;
    onFeeSelect?.(newTip);
  };

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
              onClick={() => handleOptionSelect(option.id as FeeOption)}
            >
              <RadioGroupItem
                value={option.id}
                checked={selectedOption === option.id}
                label={option.name}
                labelCSS={styles.optionLabel}
                onChange={() => handleOptionSelect(option.id as FeeOption)}
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
        <Button
          size="xs"
          variant="link"
          onPress={onCustomFees}
          css={styles.customFeesBtn}
        >
          Use custom fees
        </Button>
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
  customFeesBtn: cssObj({
    alignSelf: 'center',
    color: '$accent11',
    fontSize: '$sm',
    mt: '$2',
  }),
};
