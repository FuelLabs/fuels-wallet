import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionBox } from '~/systems/Core';
import type { SimplifiedOperation } from '../../types';
import { TxOperationCard } from './TxOperationCard';

export type TxOperationProps = {
  operation: SimplifiedOperation;
  isChild?: boolean;
};

export function TxOperation({ operation, isChild = false }: TxOperationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isGrouped = (operation.operations?.length || 0) > 1;

  return (
    <Box.Stack gap="$2" css={styles.root}>
      <Box.Flex css={styles.container} data-child={isChild}>
        <Box.Flex css={styles.cardStyle}>
          <TxOperationCard operation={operation} />
        </Box.Flex>
      </Box.Flex>
      {isGrouped && (
        <>
          <Box.Flex
            as="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            css={styles.header}
            justify="center"
          >
            <Text fontSize="sm" css={styles.toggle}>
              <Icon
                icon={isExpanded ? 'ArrowsDiagonalMinimize2' : 'ArrowsDiagonal'}
                css={styles.chevron}
                data-expanded={isExpanded}
              />
              {isExpanded ? 'Collapse' : 'Expand'}
              <Text fontSize="sm" css={cssObj({ color: '$gray11' })}>
                {!isExpanded && `(+${operation.operations?.length} operations)`}
              </Text>
            </Text>
          </Box.Flex>
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
          >
            {operation.operations?.map((operation, index) => (
              <Box.Flex
                key={`${operation.type}-${operation.from?.address || ''}-${operation.to?.address || ''}-${index}`}
                css={styles.cardStyle}
              >
                <TxOperation operation={operation} isChild />
              </Box.Flex>
            ))}
          </MotionBox>
        </>
      )}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    width: '100%',
  }),
  container: cssObj({
    padding: '2px',
    gap: '$2',
    '&[data-child="true"]': {
      padding: 0,
    },
  }),
  header: cssObj({
    display: 'flex',
    cursor: 'pointer',
    width: '100%',
    bg: 'transparent',
    padding: '0 $4',
    alignItems: 'center',
    border: 'none',
  }),
  chevron: cssObj({
    transition: 'all 0.2s ease',
    display: 'inline-block',
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
    padding: '2px',
    gap: '2px',
  }),
  cardStyle: cssObj({
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
  }),
};
