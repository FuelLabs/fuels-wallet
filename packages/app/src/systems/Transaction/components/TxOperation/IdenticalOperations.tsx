import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionStack, animations } from '~/systems/Core';
import type { SimplifiedOperation } from '../../types';
import { TxOperationCard } from './TxOperationCard';

type IdenticalOpsProps = {
  count: number;
  instances: SimplifiedOperation[];
};

export function IdenticalOperations({ count, instances }: IdenticalOpsProps) {
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

const styles = {
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
