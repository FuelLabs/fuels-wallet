import { Box, Button, Form, Input, Text, VStack } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';
import { type BN, bn } from 'fuels';
import { useEffect, useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { MotionFlex, MotionStack, animations } from '~/systems/Core';
import type { SendFormValues } from '~/systems/Send/hooks';
import { TxFee } from '../TxFee';

type TxFeeOptionsProps = {
  baseFee: BN;
  baseGasLimit: BN;
  regularTip: BN;
  fastTip: BN;
};

export const TxFeeOptions = ({
  baseFee,
  baseGasLimit,
  regularTip,
  fastTip,
}: TxFeeOptionsProps) => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const { control, setValue, trigger } = useFormContext<SendFormValues>();

  const { field: tip } = useController({
    control,
    name: 'fees.tip',
  });

  // @TODO: Remove this when the SDK gets to work with custom gas limits
  const { field: _gasLimit, fieldState: _gasLimitState } = useController({
    control,
    name: 'fees.gasLimit',
  });

  const options = useMemo(() => {
    return [
      { name: 'Regular', fee: baseFee.add(regularTip), tip: regularTip },
      { name: 'Fast', fee: baseFee.add(fastTip), tip: fastTip },
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
      setValue('fees.tip', regularTip);
      setValue('fees.gasLimit', baseGasLimit);
    }
  }, [isAdvanced, setValue, regularTip, baseGasLimit]);

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
                <Input.Field
                  ref={tip.ref}
                  value={tip.value.toString()}
                  type="number"
                  onChange={(e) => {
                    const ignore = /[.,\-+]/g;
                    const val = (e.target.value || '').replaceAll(ignore, '');
                    tip.onChange(bn(val));
                    trigger('amount');
                  }}
                />
              </Input>
            </VStack>
            {/* @TODO: Remove this when the SDK gets to work with custom gas limits */}
            {/* <VStack gap="$1">
              <Text fontSize="xs">Gas limit</Text>
              <Form.Control isRequired isInvalid={Boolean(gasLimitState.error)}>
                <Input>
                  <Input.Field
                    ref={gasLimit.ref}
                    value={gasLimit.value.toString()}
                    type="number"
                    onChange={(e) => {
                      const ignore = /[.,\-+]/g;
                      const val = (e.target.value || '').replaceAll(ignore, '');
                      gasLimit.onChange(bn(val));
                    }}
                  />
                </Input>
                {gasLimitState.error && (
                  <Form.ErrorMessage aria-label="Error message">
                    {gasLimitState.error.message}
                  </Form.ErrorMessage>
                )}
              </Form.Control>
            </VStack> */}
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
            Use {isAdvanced ? 'regular' : 'advanced'} options
          </Button>
        </MotionFlex>
      </AnimatePresence>
    </Box.Stack>
  );
};
