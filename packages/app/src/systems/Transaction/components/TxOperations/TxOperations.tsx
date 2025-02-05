import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useMemo, useState } from 'react';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { CategorizedOperations, SimplifiedOperation } from '../../types';
import { TxCategory } from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperation } from '../TxOperation';

type GroupedOperations = {
  type: TxCategory;
  operations: SimplifiedOperation[];
};

type OperationsDrawerProps = {
  operations: GroupedOperations;
  defaultExpanded?: boolean;
};

function OperationsDrawer({
  operations,
  defaultExpanded = true,
}: OperationsDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const title = useMemo(() => {
    const count = operations.operations.length;
    const labels = {
      [TxCategory.SEND]: 'Send',
      [TxCategory.RECEIVE]: 'Receive',
      [TxCategory.CONTRACTCALL]: 'Contract Call',
      [TxCategory.SCRIPT]: 'Script',
      [TxCategory.PREDICATE]: 'Predicate',
    };
    return `${count} ${labels[operations.type] || 'Operation'}${count > 1 ? 's' : ''}`;
  }, [operations]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Box css={styles.drawer} data-expanded={isExpanded}>
      <Box.Flex
        as="button"
        onClick={handleClick}
        css={styles.header({ isExpanded })}
        justify="space-between"
      >
        <Text fontSize="sm" css={styles.title}>
          {title}
        </Text>
        <Icon
          icon="ChevronRight"
          css={styles.chevron}
          data-expanded={isExpanded}
        />
      </Box.Flex>
      <MotionBox
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        css={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        {operations.operations.map((operation, index) =>
          isExpanded ? (
            <Box.Flex
              key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
              css={styles.operation}
            >
              <TxOperation operation={operation} showNesting={false} flat />
            </Box.Flex>
          ) : null
        )}
      </MotionBox>
    </Box>
  );
}

type TxOperationsListProps = {
  operations: CategorizedOperations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const groupedMainOperations = useMemo(() => {
    const groups = new Map<TxCategory, SimplifiedOperation[]>();

    for (const op of operations.mainOperations) {
      const existing = groups.get(op.type) || [];
      groups.set(op.type, [...existing, op]);
    }

    return Array.from(groups.entries()).map(([type, ops]) => ({
      type,
      operations: ops,
    }));
  }, [operations.mainOperations]);

  return (
    <Box.Stack gap="$2">
      {/* Main operations grouped by type */}
      {groupedMainOperations.map((group) => (
        <OperationsDrawer
          key={group.type}
          operations={group}
          defaultExpanded={true}
        />
      ))}

      {/* Other root operations */}
      <TxOperationsGroup
        title="Other Contract Calls"
        operations={operations.otherRootOperations}
        showNesting={false}
        numberLabel="1"
      />

      {/* Intermediate operations */}
      <TxOperationsGroup
        title="Intermediate Operations"
        operations={operations.intermediateOperations}
        showNesting={true}
        numberLabel={operations.otherRootOperations.length ? '2' : '1'}
      />
    </Box.Stack>
  );
}

const styles = {
  drawer: cssObj({
    backgroundColor: '$gray2',
    borderRadius: '8px',
    border: '1px solid $gray5',
    marginBottom: '$2',
    overflow: 'hidden',
  }),
  header: ({ isExpanded }: { isExpanded: boolean }) =>
    cssObj({
      display: 'flex',
      cursor: 'pointer',
      width: '100%',
      backgroundColor: 'transparent',
      padding: '$3',
      alignItems: 'center',
      border: 'none',
      borderBottom: isExpanded ? '1px solid $gray5' : 'none',
      minHeight: '50px',
    }),
  title: cssObj({
    letterSpacing: '-0.01em',
    color: '#646464',
    fontWeight: '$medium',
    fontSize: '13px',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }),
  operation: cssObj({
    flex: 1,
    boxSizing: 'border-box',
  }),
  chevron: cssObj({
    transform: 'rotate(0deg)',
    transition: 'transform 0.2s ease',

    '&[data-expanded=true]': {
      transform: 'rotate(90deg)',
    },
  }),
};

TxOperations.Loader = function TxOperationsLoader() {
  return (
    <Box.Stack gap="$1">
      {[1, 2].map((i) => (
        <Box
          key={i}
          css={{
            height: '80px',
            backgroundColor: '$gray2',
            borderRadius: '$md',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      ))}
    </Box.Stack>
  );
};
