import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  Form,
  HStack,
  Input,
  RadioGroup,
  RadioGroupItem,
  Text,
} from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';
import type { BN } from 'fuels';
import { DEFAULT_PRECISION, bn } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { MotionFlex, MotionStack, animations } from '~/systems/Core';
import { createAmount } from '~/systems/Core/components/InputAmount/InputAmount';
import { isAmountAllowed } from '~/systems/Core/components/InputAmount/InputAmount.utils';
import type { SendFormValues } from '~/systems/Send/hooks';
import {
  DECIMAL_UNITS,
  formatTip,
  isGasLimitAllowed,
} from './TxFeeOptions.utils';

type TxFeeOptionsProps = {
  initialAdvanced: boolean;
  baseFee: BN;
  gasLimit: BN;
  regularTip: BN;
  fastTip: BN;
  onRecalculate?: (tip: BN) => void;
};

export function TxFeeOptions({
  initialAdvanced,
  baseFee,
  gasLimit: gasLimitInput,
  regularTip,
  fastTip,
  onRecalculate,
}: TxFeeOptionsProps) {
  const { control, setValue, getValues } = useFormContext<SendFormValues>();
  const [isAdvanced, setIsAdvanced] = useState(initialAdvanced);
  const previousGasLimit = useRef<BN>(gasLimitInput);
  const previousDefaultTip = useRef<BN>(regularTip);

  const { field: tip, fieldState: tipState } = useController({
    control,
    name: 'fees.tip',
  });

  const { field: gasLimit, fieldState: gasLimitState } = useController({
    control,
    name: 'fees.gasLimit',
  });

  const advancedFee = baseFee.add(tip.value.amount);

  const options = useMemo(() => {
    return [
      {
        id: 'regular',
        name: 'Regular',
        fee: baseFee.add(regularTip),
        tip: regularTip,
      },
      { id: 'fast', name: 'Fast', fee: baseFee.add(fastTip), tip: fastTip },
    ];
  }, [baseFee, regularTip, fastTip]);

  const toggle = () => {
    setIsAdvanced((curr) => !curr);
  };

  /**
   * Resetting fees if hiding advanced options (or initializing them)
   */
  useEffect(() => {
    if (!isAdvanced) {
      const [currentTip, currentGasLimit] = getValues([
        'fees.tip.amount',
        'fees.gasLimit.amount',
      ]);

      if (!currentGasLimit.eq(previousGasLimit.current)) {
        setValue('fees.gasLimit', {
          amount: previousGasLimit.current,
          text: previousGasLimit.current.toString(),
        });
      }

      if (!currentTip.eq(previousDefaultTip.current)) {
        setValue('fees.tip', {
          amount: previousDefaultTip.current,
          text: formatTip(previousDefaultTip.current),
        });
      }
    }
  }, [isAdvanced, setValue, getValues]);

  return (
    <Box.Stack gap="$2">
      <AnimatePresence mode="popLayout">
        {isAdvanced ? (
          <MotionStack {...animations.slideInTop()} key="advanced" gap="$3">
            <Box css={styles.content}>
              <Box css={styles.card}>
                <HStack justify="space-between">
                  <Text>Fee + Tip</Text>
                  <Text>
                    <Text as="span" color="gray8">
                      (
                      {advancedFee
                        ? `${advancedFee.format({
                            minPrecision: DEFAULT_PRECISION,
                            precision: DEFAULT_PRECISION,
                          })} ETH`
                        : '--'}
                      )
                    </Text>
                  </Text>
                </HStack>
              </Box>
              <HStack justify="between" gap="$4">
                <Box css={styles.inputBox}>
                  <Text fontSize="xs">Gas limit</Text>
                  <Form.Control isInvalid={Boolean(gasLimitState.error)}>
                    <Input size="sm">
                      <Input.Number
                        value={gasLimit.value.text}
                        inputMode="numeric"
                        autoComplete="off"
                        allowNegative={false}
                        thousandSeparator={false}
                        placeholder="0"
                        css={{ width: '100%' }}
                        name={gasLimit.name}
                        decimalScale={0}
                        isAllowed={isGasLimitAllowed}
                        onChange={(e) => {
                          const val = e.target.value;

                          gasLimit.onChange({
                            amount: bn(val),
                            text: val,
                          });
                        }}
                      />
                    </Input>
                  </Form.Control>
                </Box>
                <Box css={styles.inputBox}>
                  <Text fontSize="xs">Tip</Text>
                  <Form.Control isInvalid={Boolean(tipState.error)}>
                    <Input size="sm">
                      <Input.Number
                        value={tip.value.text}
                        inputMode="decimal"
                        autoComplete="off"
                        allowedDecimalSeparators={['.']}
                        allowNegative={false}
                        thousandSeparator={false}
                        decimalScale={DECIMAL_UNITS}
                        placeholder="0.00"
                        css={{ width: '100%' }}
                        isAllowed={isAmountAllowed}
                        onChange={(e) => {
                          const text = e.target.value;
                          const { text: newText, amount } = createAmount(
                            text,
                            DECIMAL_UNITS
                          );

                          tip.onChange({
                            amount,
                            text: newText,
                          });
                        }}
                      />
                    </Input>
                  </Form.Control>
                </Box>
              </HStack>
              {(gasLimitState.error || tipState.error) && (
                <MotionFlex {...animations.fadeIn()} key="error" layout>
                  <Form.Control isInvalid>
                    <Form.ErrorMessage
                      aria-label="Error message"
                      css={{ padding: 0 }}
                    >
                      {gasLimitState.error?.message || tipState.error?.message}
                    </Form.ErrorMessage>
                  </Form.Control>
                </MotionFlex>
              )}
            </Box>
          </MotionStack>
        ) : (
          <MotionStack {...animations.slideInTop()} key="regular" gap="$2">
            <RadioGroup>
              {options.map((option) => (
                <Box.Flex key={option.id} css={styles.option}>
                  <RadioGroupItem
                    value={option.id}
                    checked={option.tip.eq(tip.value.amount)}
                    label={option.name}
                    labelCSS={styles.optionLabel}
                    onSelect={() => {
                      previousDefaultTip.current = option.tip;
                      setValue('fees.tip', {
                        amount: option.tip,
                        text: formatTip(option.tip),
                      });
                      onRecalculate?.(option.tip);
                    }}
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
          </MotionStack>
        )}
        <MotionFlex
          {...animations.fadeIn()}
          key="toggle"
          align="center"
          direction="column"
          layout
        >
          <Button size="xs" variant="link" onPress={toggle}>
            Use {isAdvanced ? 'regular options' : 'custom fees'}
          </Button>
        </MotionFlex>
      </AnimatePresence>
    </Box.Stack>
  );
}

const styles = {
  detailItem: (checked: boolean, clickable: boolean) =>
    cssObj({
      padding: '$4',
      display: 'flex',
      flexDirection: 'column',
      gap: '$1',
      cursor: clickable ? 'pointer' : 'default',
      backgroundColor: checked ? '$accent3' : '$gray1',
      border: '1px solid',
      borderColor: checked ? '$accent7' : '$gray6',
      transition: 'all 0.2s ease',

      '&:hover': clickable
        ? {
            backgroundColor: checked ? '$accent4' : '$gray4',
            borderColor: checked ? '$accent8' : '$gray8',
          }
        : {},
    }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$normal',
  }),
  amount: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    padding: '$3',
  }),
  option: cssObj({
    alignItems: 'center',
    backgroundColor: '$white',
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
  card: cssObj({
    padding: '$4',
    backgroundColor: '$gray1',
    border: '1px solid $gray6',
    borderRadius: '10px',
    fontSize: '13px',
  }),
  inputBox: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  }),
  input: cssObj({
    borderRadius: '8px',
    '&>input': {
      width: '100%',
    },
  }),
  backButton: cssObj({
    alignSelf: 'center',
    color: '$accent11',
    fontSize: '12px',
    mt: '$2',
  }),
};
