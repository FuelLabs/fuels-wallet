import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import type { SimplifiedOperation } from '../../../types';
import { TxOperation } from './operations/TxOperation';

type TxOperationsGroupProps = {
  title: string;
  operations: SimplifiedOperation[];
  showNesting?: boolean;
};

export function TxOperationsGroup({
  title,
  operations,
  showNesting,
}: TxOperationsGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!operations.length) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Box.Stack gap="$2" css={styles.root}>
      <Box.Flex as="button" onClick={handleClick} css={styles.header}>
        <Text css={styles.count}>{operations.length}</Text>
        <Text fontSize="sm" css={styles.title}>
          {title}
        </Text>
        <Icon
          icon="ChevronRight"
          css={styles.chevron}
          data-expanded={isExpanded}
        />
      </Box.Flex>
      {isExpanded && (
        <Box.Stack
          gap="$1"
          css={styles.content}
          onClick={(e) => e.stopPropagation()}
        >
          {operations.map((operation, index) => (
            <TxOperation
              key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
              operation={operation}
              showNesting={showNesting}
            />
          ))}
        </Box.Stack>
      )}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    marginTop: '$2',
    backgroundColor: '#E0E0E0',
    borderRadius: '12px',
  }),
  header: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    padding: '$2',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
  }),
  icon: cssObj({
    color: '#202020',
  }),
  title: cssObj({
    color: '#202020',
    fontWeight: '$medium',
  }),
  content: cssObj({}),
  count: cssObj({
    backgroundColor: 'white',
    borderRadius: '$full',
    padding: '$1',
    color: '#202020',
    border: '1.5px solid #8D8D8D',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  chevron: cssObj({
    transform: 'rotate(0deg)',
    transition: 'transform 0.2s ease',

    '&[data-expanded=true]': {
      transform: 'rotate(90deg)',
    },
  }),
};
