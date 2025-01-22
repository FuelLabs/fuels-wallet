import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../../types';
import { useEcosystemProject } from '../useEcosystemProject';
import { isSwapMetadata } from '../utils';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';

type TxOperationSwapProps = {
  operation: SimplifiedOperation;
};

export function TxOperationSwap({ operation }: TxOperationSwapProps) {
  const {
    name: projectName,
    image: projectImage,
    isLoading,
  } = useEcosystemProject(operation.to);

  if (!isSwapMetadata(operation.metadata)) return null;

  return (
    <>
      <TxAddressDisplay
        address={operation.to}
        name={projectName}
        image={projectImage}
        isLoading={isLoading}
        isContract
      />
      <Box.Flex css={styles.line}>
        <Box css={styles.iconCol}>
          <Icon icon="ArrowDown" css={{ color: '$blue9' }} size={16} />
        </Box>
        <TxAssetDisplay
          amount={operation.metadata.receiveAmount.toString()}
          assetId={operation.metadata.receiveAssetId}
          label="Sends token"
          showIcon={false}
        />
      </Box.Flex>
    </>
  );
}

const styles = {
  line: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$3',
  }),
  iconCol: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    flexShrink: 0,
  }),
};
