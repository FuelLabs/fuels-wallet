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
        <Icon
          icon={isExpanded ? 'CaretDown' : 'CaretRight'}
          size={16}
          css={styles.icon}
        />
        <Text fontSize="sm" css={styles.title}>
          {title} ({operations.length})
        </Text>
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
    borderTop: '1px solid $border',
    marginTop: '$2',
    paddingTop: '$2',
  }),
  header: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    padding: '$2',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    borderRadius: '$md',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '$gray3',
    },
  }),
  icon: cssObj({
    color: '$gray8',
  }),
  title: cssObj({
    color: '$gray8',
    fontWeight: '$medium',
  }),
  content: cssObj({
    paddingLeft: '$6',
  }),
};
