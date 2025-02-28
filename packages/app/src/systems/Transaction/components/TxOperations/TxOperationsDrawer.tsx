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
          <Text fontSize="sm" css={styles.toggle}>
            {isExpanded ? 'Collapse' : 'Expand'}
            <Icon
              icon={isExpanded ? 'ArrowsMaximize' : 'ArrowsMinimize'}
              css={styles.chevron}
              data-expanded={isExpanded}
            />
          </Text>
        </Box.Flex>
      )}
      {operations.length === 0 && (
        <Box css={styles.header({ isExpanded })}>
          <Text fontSize="sm" css={styles.title}>
            No root operations related to this account.
          </Text>
        </Box>
      )}
      <MotionBox
        initial={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
          opacity: { duration: 0.2 },
        }}
        css={styles.expandedOperations}
        onClick={(e) => e.stopPropagation()}
      >
        {operations.map((operation, index) => (
          <Box.Flex
            key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
            css={[
              styles.operation,
              isExpanded ? {} : cssObj({ display: 'none' }),
            ]}
          >
            <TxOperation operation={operation} />
          </Box.Flex>
        ))}
      </MotionBox>
    </Box>
  );
}

const styles = {
  drawer: cssObj({
    backgroundColor: '$gray2',
    borderRadius: '8px',
    // border: '1px solid $gray5',
    boxShadow:
      '0px 0px 0px 1px rgba(32, 32, 32, 0.12), 0px 2px 6px -1px rgba(32, 32, 32, 0.10)',
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
  toggle: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    color: '$gray12',
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
    display: 'inline-block',
  }),
};
