import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionBox, MotionStack, animations } from '~/systems/Core';
import { useAssetsAmount } from '../../hooks/useAssetsAmount';
import type { BidirectionalInfo, SimplifiedOperation } from '../../types.tsx';
import { TxOperationCard } from './TxOperationCard';

export type TxOperationProps = {
  operation: SimplifiedOperation;
};

type IdenticalOpsProps = {
  count: number;
  instances: SimplifiedOperation[];
};

function IdenticalOperations({ count, instances }: IdenticalOpsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box css={styles.identicalOps}>
      <Box.Flex
        as="button"
        onClick={() => setIsExpanded(!isExpanded)}
        css={styles.identicalOpsHeader}
        justify="space-between"
      >
        <Text>This contract call occurs {count} times</Text>
        <Icon
          icon="ChevronDown"
          css={styles.chevron}
          data-expanded={isExpanded}
        />
      </Box.Flex>

      <Box.Stack gap="0">
        <TxOperationCard operation={instances[0]} />
        {isExpanded && (
          <MotionStack {...animations.slideInTop()} gap="0">
            {instances.slice(1).map((op) => (
              <TxOperationCard
                key={`${op.from.address}-${op.to.address}-${op.metadata?.functionName || ''}`}
                operation={op}
              />
            ))}
          </MotionStack>
        )}
      </Box.Stack>
    </Box>
  );
}

export function TxOperation({ operation }: TxOperationProps) {
  const { metadata, assets } = operation;
  const amounts = useAssetsAmount({
    operationsCoin: assets,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const identicalOps = operation.metadata?.identicalOps || [];

  return (
    <Box.Stack gap="$2" css={styles.root}>
      <TxOperationCard
        operation={operation}
        assetsAmount={amounts}
        css={styles.card}
      />
      {metadata.childOperations && metadata.childOperations.length > 1 && (
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
            />
          ))}
        </MotionBox>
      )}
      {identicalOps.map((group) => (
        <IdenticalOperations
          key={`${group.operation.from.address}-${group.operation.to.address}-${group.count}`}
          {...group}
        />
      ))}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    width: '100%',
  }),
  card: cssObj({
    // borderRadius: '8px',
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
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
    padding: '0',
    margin: '0 0 4px',
    overflow: 'hidden',
  }),
  identicalOps: cssObj({
    borderRadius: '8px',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
    overflow: 'hidden',
    margin: '0 $1 $2',
  }),
  identicalOpsHeader: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    padding: '0 16px',
    cursor: 'pointer',
    backgroundColor: '$gray2',
    border: 'none',
    height: '50px',
    width: '100%',
  }),
  chevron: cssObj({
    transform: 'rotate(0deg)',
    transition: 'transform 0.3s ease',

    '&[data-expanded=true]': {
      transform: 'rotate(180deg)',
    },
  }),
};
