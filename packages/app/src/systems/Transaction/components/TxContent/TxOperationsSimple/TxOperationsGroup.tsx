import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { SimplifiedOperation } from '../../../types';
import { TxOperation } from '../../TxOperation';

type TxOperationsGroupProps = {
  title: string;
  operations: SimplifiedOperation[];
  showNesting?: boolean;
  numberLabel?: string;
};

export type BidirectionalInfo = 'atob' | 'btoa' | null;

function getBidirectionalInfo(
  current: SimplifiedOperation,
  next: SimplifiedOperation
): BidirectionalInfo {
  if (
    current?.to?.address === next?.from?.address &&
    current?.from?.address === next?.to?.address
  ) {
    return 'atob';
  }

  if (
    current?.from?.address === next?.from?.address &&
    current?.to?.address === next?.to?.address
  ) {
    return 'btoa';
  }

  return null;
}

export function TxOperationsGroup({
  title,
  operations,
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
          icon={isExpanded ? 'ChevronDown' : 'Minus'}
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
              bidirectionalInfo={getBidirectionalInfo(
                operation,
                operations[index + 1]
              )}
            />
          ) : null
        )}
      </MotionBox>
    </Box>
  );
}

const styles = {
  root: cssObj({
    margin: '0 0 $2',
    backgroundColor: '$gray5',
    borderRadius: '12px',
    minHeight: '56px',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '4px',
    boxSizing: 'border-box',
    padding: '0 $1',
  }),
  header: cssObj({
    display: 'flex',
    gap: '$1',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    backgroundColor: 'transparent',
    padding: '17px 16px 12px 18px',
    alignItems: 'center',
  }),
  icon: cssObj({
    color: '#202020',
  }),
  title: cssObj({
    color: '$gray12',
    fontWeight: '$medium',
    textAlign: 'left',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px 0',
  }),
  numberLabel: cssObj({
    backgroundColor: '$gray1',
    borderRadius: '$full',
    color: '$gray12',
    border: '1.5px solid $gray8',
    width: '20px',
    height: '20px',
    minWidth: '20px',
    minHeight: '20px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
  }),
  chevron: cssObj({
    transition: 'transform 0.3s ease',

    '&[data-expanded=true]': {
      transform: 'rotate(360deg)',
    },
  }),
};
