import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionBox, animations } from '~/systems/Core';
import { useAssetsAmount } from '../../hooks/useAssetsAmount';
import type { SimplifiedOperation } from '../../types';
import { TxOperationCard } from './TxOperationCard';

export type TxOperationProps = {
  operation: SimplifiedOperation;
  showNesting?: boolean;
  flat?: boolean;
};

export function TxOperation({
  operation,
  // showNesting = true,
  flat = false,
}: TxOperationProps) {
  const { metadata, assets } = operation;
  const amounts = useAssetsAmount({
    operationsCoin: assets,
  });
  const depth = metadata?.depth || 0;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box.VStack grow={1} css={styles.root(flat)}>
      <TxOperationCard
        operation={operation}
        assetsAmount={amounts}
        depth={depth}
        flat={flat}
      />
      {metadata.operationCount && metadata.operationCount > 1 && (
        <MotionBox
          {...animations.fadeIn()}
          css={styles.operationCount}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon
            icon={isExpanded ? 'ArrowsMinimize' : 'ArrowsMaximize'}
            size={20}
          />
          <Text fontSize="sm" color="gray12" as="span">
            {isExpanded ? 'Collapse' : 'Expand'}
          </Text>
          {isExpanded ? null : (
            <Text fontSize="sm" color="gray11" as="span">
              (+{metadata.operationCount} operations)
            </Text>
          )}
        </MotionBox>
      )}
      {isExpanded && (
        <MotionBox {...animations.slideInTop()} css={styles.expandedOperations}>
          {metadata.childOperations?.map((op, idx) => (
            <TxOperationCard
              key={`${op.type}-${op.from.address}-${op.to.address}-${idx}`}
              operation={op}
              assetsAmount={[]}
              depth={depth}
            />
          ))}
        </MotionBox>
      )}
    </Box.VStack>
  );
}

const styles = {
  root: (flat: boolean) =>
    cssObj({
      padding: flat ? '0' : '0 4px',
    }),
  operationCount: {
    marginTop: '$2',
    marginLeft: '$2',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    justifyContent: 'center',
    marginBottom: '$2',
    cursor: 'pointer',
  },
  expandedOperations: cssObj({
    display: 'flex',
    flexDirection: 'column',
    padding: '$1',
  }),
};
