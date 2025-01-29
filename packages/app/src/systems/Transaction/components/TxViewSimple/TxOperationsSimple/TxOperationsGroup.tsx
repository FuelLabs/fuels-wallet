import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { animations } from '~/systems/Core';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { SimplifiedOperation } from '../../../types';
import { TxOperation } from './operations/TxOperation';

type TxOperationsGroupProps = {
  title: string;
  operations: SimplifiedOperation[];
  showNesting?: boolean;
  numberLabel?: string;
};

export function TxOperationsGroup({
  title,
  operations,
  showNesting,
  numberLabel,
}: TxOperationsGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!operations.length) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Box css={styles.root} data-expanded={isExpanded}>
      <Box.Flex
        as="button"
        onClick={handleClick}
        css={styles.header}
        justify="space-between"
      >
        <Box.Flex gap="$2" align="center">
          <Text css={styles.numberLabel}>{numberLabel}</Text>
          <Text fontSize="sm" css={styles.title}>
            {title}
          </Text>
        </Box.Flex>
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
        {operations.map((operation, index) =>
          isExpanded ? (
            <TxOperation
              key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
              operation={operation}
              showNesting={showNesting}
            />
          ) : null
        )}
      </MotionBox>
    </Box>
  );
}

const styles = {
  root: cssObj({
    marginTop: '$2',
    backgroundColor: '#E0E0E0',
    borderRadius: '12px',
    minHeight: '56px',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '4px',
    boxSizing: 'border-box',
  }),
  header: cssObj({
    display: 'flex',
    gap: '$2',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    backgroundColor: 'transparent',
    padding: '17px 22px 12px 22px',
    alignItems: 'center',
  }),
  icon: cssObj({
    color: '#202020',
  }),
  title: cssObj({
    color: '#202020',
    fontWeight: '$medium',
    textAlign: 'left',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px 0',
  }),
  numberLabel: cssObj({
    backgroundColor: '$white',
    borderRadius: '$full',
    color: '#202020',
    border: '1.5px solid #8D8D8D',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
  }),
  chevron: cssObj({
    transform: 'rotate(0deg)',
    transition: 'transform 0.2s ease',

    '&[data-expanded=true]': {
      transform: 'rotate(90deg)',
    },
  }),
};
