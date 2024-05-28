import { Box, Button, Form, Input, Text, VStack } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';
import { type BN, DEFAULT_DECIMAL_UNITS, bn } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { MotionFlex, MotionStack, animations } from '~/systems/Core';
import type { SendFormValues } from '~/systems/Send/hooks';
import { TxFee } from '../TxFee';

type TxFeeOptionsProps = {
  baseFee: BN;
  regularTip: BN;
  fastTip: BN;
  error: string | null;
};

const DECIMAL_UNITS = DEFAULT_DECIMAL_UNITS;

export const TxFeeOptions = ({
  baseFee,
  regularTip,
  fastTip,
  error,
}: TxFeeOptionsProps) => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const { control, setValue, trigger } = useFormContext<SendFormValues>();
  const previousDefaultTip = useRef<BN>(regularTip);

  const { field: tip } = useController({
    control,
    name: 'fees.tip',
  });

  const { field: gasLimit, fieldState: gasLimitState } = useController({
    control,
    name: 'fees.gasLimit',
  });

  const options = useMemo(() => {
    return [
      { name: 'Regular', fee: baseFee.add(regularTip), tip: regularTip },
      { name: 'Fast', fee: baseFee.add(fastTip), tip: fastTip },
    ];
  }, [baseFee, regularTip, fastTip]);

  const tipFormatted = useMemo<string>(() => {
    if (tip.value.isZero()) return '';

    return tip.value.format({
      units: DECIMAL_UNITS,
      minPrecision: 0,
    });
  }, [tip.value]);

  const gasLimitFormatted = useMemo<string>(() => {
    if (gasLimit.value.isZero()) return '';

    return gasLimit.value.toString();
  }, [gasLimit.value]);

  const toggle = () => {
    setIsAdvanced((curr) => !curr);
  };

  /**
   * Resetting fees if hiding advanced options (or initializing them)
   */
  useEffect(() => {
    if (!isAdvanced) {
      setValue('fees.tip', previousDefaultTip.current);
      setValue('fees.gasLimit', bn(0));
    }
  }, [isAdvanced, setValue]);

  return (
    <Box.Stack gap="$1">
      <AnimatePresence mode="popLayout">
        {isAdvanced ? (
          <MotionStack
            {...animations.slideInTop()}
            key="advanced"
            gap="$3"
            layout
          >
            <VStack gap="$1">
              <Text fontSize="xs">Tip</Text>
              <Input>
                <Input.Number
                  value={tipFormatted}
                  inputMode="decimal"
                  autoComplete="off"
                  allowedDecimalSeparators={['.', ',']}
                  allowNegative={false}
                  thousandSeparator={false}
                  decimalScale={DECIMAL_UNITS}
                  placeholder="0.00"
                  onChange={(e) => {
                    const text = e.target.value;
                    const val = text.replaceAll(',', '');
                    const units = bn.parseUnits(val, DECIMAL_UNITS);

                    tip.onChange(units);
                    trigger('amount');
                  }}
                />
              </Input>
            </VStack>
            <VStack gap="$1">
              <Text fontSize="xs">Gas limit</Text>
              <Form.Control isInvalid={Boolean(gasLimitState.error || error)}>
                <Input isInvalid={Boolean(gasLimitState.error || error)}>
                  <Input.Field
                    ref={gasLimit.ref}
                    value={gasLimitFormatted}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      const ignore = /[.,\-+]/g;
                      const val = (e.target.value || '').replaceAll(ignore, '');
                      gasLimit.onChange(bn(val));
                    }}
                  />
                </Input>
                {(error || gasLimitState.error) && (
                  <Form.ErrorMessage aria-label="Error message">
                    {error || gasLimitState.error?.message}
                  </Form.ErrorMessage>
                )}
              </Form.Control>
            </VStack>
          </MotionStack>
        ) : (
          <MotionStack
            {...animations.slideInTop()}
            key="regular"
            gap="$3"
            layout
          >
            {options.map((option) => (
              <TxFee
                key={option.name}
                fee={option.fee}
                title={option.name}
                checked={option.tip.eq(tip.value)}
                onChecked={() => {
                  previousDefaultTip.current = option.tip;
                  setValue('fees.tip', option.tip);
                  trigger('amount');
                }}
              />
            ))}
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
};
