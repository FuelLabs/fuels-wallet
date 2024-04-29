import { Box, Button } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';
import type { BN } from 'fuels';
import { MotionFlex, MotionStack, animations } from '~/systems/Core';
import type { FeeType } from '~/systems/Send/hooks';
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
            @TODO: Add tip and gas limit fields here
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
