import { Box } from '@fuel-ui/react';
import type { BN } from 'fuels';
import type { FeeType } from '~/systems/Send/hooks';
import { TxFee } from '../TxFee/TxFee';

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

  return (
    <Box.Stack gap="$1">
      {!isAdvanced && (
        <>
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
        </>
      )}
      <TxFee
        fee={undefined}
        title="Advanced"
        checked={isAdvanced}
        onChecked={() => onChangeCurrentFeeType('advanced')}
      />
    </Box.Stack>
  );
};
