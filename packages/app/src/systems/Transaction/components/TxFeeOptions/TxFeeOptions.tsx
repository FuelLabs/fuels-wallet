import { Box, Button, Input, Text, VStack } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';
import type { BN } from 'fuels';
import { useController, useFormContext } from 'react-hook-form';
import { MotionFlex, MotionStack, animations } from '~/systems/Core';
import type { FeeType, SendFormValues } from '~/systems/Send/hooks';
import { TxFee } from '../TxFee';

type TxFeeOptionsProps = {
  fastFee?: BN;
  regularFee?: BN;
  currentFeeType: FeeType;
  onChangeCurrentFeeType: (feeType: FeeType) => void;
};

export const TxFeeOptions = ({
  fastFee,
  regularFee,
  currentFeeType,
  onChangeCurrentFeeType,
}: TxFeeOptionsProps) => {
  const { control } = useFormContext<SendFormValues>();
  const { field: tip } = useController({
    control,
    name: 'fees.tip',
  });
  const { field: gasLimit } = useController({
    control,
    name: 'fees.gasLimit',
  });

  const isAdvanced = currentFeeType === 'advanced';

  const toggle = () => {
    if (isAdvanced) {
      onChangeCurrentFeeType('regular');
      return;
    }

    onChangeCurrentFeeType('advanced');
  };

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
                <Input.Field {...tip} />
              </Input>
            </VStack>
            <VStack gap="$1">
              <Text fontSize="xs">Gas limit</Text>
              <Input>
                <Input.Field {...gasLimit} />
              </Input>
            </VStack>
          </MotionStack>
        ) : (
          <MotionStack
            {...animations.slideInTop()}
            key="regular"
            gap="$3"
            layout
          >
            <TxFee
              fee={regularFee}
              title="Regular"
              checked={currentFeeType === 'regular'}
              onChecked={() => onChangeCurrentFeeType('regular')}
            />
            <TxFee
              fee={fastFee}
              title="Fast"
              checked={currentFeeType === 'fast'}
              onChecked={() => onChangeCurrentFeeType('fast')}
            />
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
            {isAdvanced ? 'Hide' : 'Show'} advanced options
          </Button>
        </MotionFlex>
      </AnimatePresence>
    </Box.Stack>
  );
};
