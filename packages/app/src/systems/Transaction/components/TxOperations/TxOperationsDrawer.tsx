import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useMemo, useState } from 'react';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { SimplifiedOperation } from '../../types';
import { TxCategory } from '../../types';
import { TxOperation } from '../TxOperation';

type TxOperationsDrawerProps = {
  operations: SimplifiedOperation[];
};

export function TxOperationsDrawer({ operations }: TxOperationsDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const title = useMemo(() => {
    const count = operations.length;
    return `${count} Contract call${count > 1 ? 's' : ''}`;
  }, [operations]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  function getBidirectionalInfo(
    previous: SimplifiedOperation,
    current: SimplifiedOperation,
    next: SimplifiedOperation
  ) {
    // if next operation is the reverse of the current operation, return 'atob'
    // if previous operation is the reverse of the current operation, return 'btoa'
    // otherwise return null
    if (
      next &&
      next.from.address === current.to.address &&
      next.to.address === current.from.address
    ) {
      return 'atob';
    }
    if (
      previous &&
      previous.from.address === current.to.address &&
      previous.to.address === current.from.address
    ) {
      return 'btoa';
    }
    return null;
  }

  return (
    <Box css={styles.drawer} data-expanded={isExpanded}>
      {operations.length > 1 && (
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
            icon={isExpanded ? 'ArrowsMaximize' : 'ArrowsMinimize'}
            css={styles.chevron}
            data-expanded={isExpanded}
          />
        </Box.Flex>
      )}
      <MotionBox
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        css={styles.expandedOperations}
        onClick={(e) => e.stopPropagation()}
      >
        {operations.map((operation, index) =>
          isExpanded ? (
            <Box.Flex
              key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
              css={styles.operation}
            >
              <TxOperation
                operation={operation}
                bidirectionalInfo={getBidirectionalInfo(
                  operations[index - 1],
                  operation,
                  operations[index + 1]
                )}
              />
            </Box.Flex>
          ) : null
        )}
      </MotionBox>
    </Box>
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
      padding: '0 $4',
      alignItems: 'center',
      border: 'none',
      borderBottom: isExpanded ? '1px solid $gray5' : 'none',
      minHeight: '36px',
    }),
  title: cssObj({
    letterSpacing: '-0.01em',
    color: '#646464',
    fontWeight: '$medium',
    fontSize: '13px',
  }),
  expandedOperations: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  }),
  operation: cssObj({
    flex: 1,
    boxSizing: 'border-box',
  }),
  chevron: cssObj({
    transition: 'all 0.2s ease',
  }),
};
