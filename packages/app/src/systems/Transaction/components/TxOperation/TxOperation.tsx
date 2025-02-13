import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionBox, animations } from '~/systems/Core';
import { useAssetsAmount } from '../../hooks/useAssetsAmount';
import type { SimplifiedOperation } from '../../types';
import type { BidirectionalInfo } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationCard } from './TxOperationCard';

export type TxOperationProps = {
  operation: SimplifiedOperation;
  showNesting?: boolean;
  flat?: boolean;
  bidirectionalInfo?: BidirectionalInfo;
};

export function TxOperation({
  operation,
  // showNesting = true,
  flat = false,
  bidirectionalInfo,
}: TxOperationProps) {
  const { metadata, assets } = operation;
  const amounts = useAssetsAmount({
    operationsCoin: assets,
  });
  const depth = metadata?.depth || 0;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box.VStack grow={1} css={styles.root}>
      <TxOperationCard
        operation={operation}
        assetsAmount={amounts}
        depth={depth}
        flat={flat}
        bidirectionalInfo={bidirectionalInfo}
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
  root: cssObj({
    padding: '0',
  }),
  operationCount: {
    marginTop: '$2',
    marginLeft: '$2',
    marginBottom: '$3',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  expandedOperations: cssObj({
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    border: '1px solid $gray5',
    padding: '0',
    margin: '0 4px 4px',
    overflow: 'hidden',
  }),
};
