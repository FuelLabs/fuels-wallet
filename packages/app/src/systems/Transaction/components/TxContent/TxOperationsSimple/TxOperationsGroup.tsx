import { cssObj, Box, Icon, Text } from '@fuel-wallet/ui';
import { type MouseEvent, useState } from 'react';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { SimplifiedOperation } from '../../../types';
import { TxOperation } from '../../TxOperation';

type TxOperationsGroupProps = {
  title: string;
  operations: SimplifiedOperation[];
  isPastTense?: boolean;
};

export function TxOperationsGroup({
  title,
  operations,
  isPastTense = false,
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
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          css={styles.content}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          {operations.map(
            (operation, index) =>
              isExpanded && (
                <Box.Flex
                  key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
                  css={styles.cardStyle}
                >
                  <TxOperation
                    operation={operation}
                    isChild
                    isPastTense={isPastTense}
                  />
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
    backgroundColor: '$cardBg',
    border: '1px solid var(--fuel-line)',
    minHeight: '48px',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  header: cssObj({
    display: 'flex',
    gap: '$1',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    backgroundColor: 'transparent',
    minHeight: '48px',
    px: '$4',
    alignItems: 'center',
    color: '$textHigh',
    transition: 'background-color 200ms',

    '@media (hover: hover)': {
      '&:hover': { backgroundColor: '$muted' },
    },
    '&:focus-visible': {
      outline: '2px solid $focus',
      outlineOffset: '-2px',
    },
  }),
  icon: cssObj({
    color: '$textLow',
  }),
  title: cssObj({
    fontFamily: '$mono',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
    textAlign: 'left',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  }),
  chevron: cssObj({
    color: '$textLow',
    transition: 'transform 300ms var(--fuel-ease-out)',
    '&[data-expanded=true]': {
      transform: 'rotate(-180deg)',
    },
  }),
  cardStyle: cssObj({
    width: '100%',
    overflow: 'hidden',
    border: '1px solid var(--fuel-line)',
  }),
};
