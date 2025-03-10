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
};

export function TxOperationsGroup({
  title,
  operations,
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
          <Text fontSize="sm" css={styles.title}>
            {title}
          </Text>
        </Box.Flex>
        <Icon
          icon={'ChevronDown'}
          css={styles.chevron}
          data-expanded={isExpanded}
        />
      </Box.Flex>
      <Box>
        <MotionBox
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          css={styles.content}
          onClick={(e) => e.stopPropagation()}
        >
          {operations.map(
            (operation, index) =>
              isExpanded && (
                <Box.Flex
                  key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
                  css={styles.cardStyle}
                >
                  <TxOperation operation={operation} isChild />
                </Box.Flex>
              )
          )}
        </MotionBox>
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    margin: '0 0 $2',
    backgroundColor: '$gray5',
    borderRadius: '10px',
    minHeight: '56px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    'html[class="fuel_dark-theme"] &': {
      bg: '$gray2',
      border: '1px solid $gray3',
    },
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
    gap: '2px',
  }),
  chevron: cssObj({
    transition: 'transform 0.3s ease',
    'html[class="fuel_dark-theme"] &': {
      color: '$gray12',
    },
    '&[data-expanded=true]': {
      transform: 'rotate(-180deg)',
    },
  }),
  cardStyle: cssObj({
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
  }),
};
