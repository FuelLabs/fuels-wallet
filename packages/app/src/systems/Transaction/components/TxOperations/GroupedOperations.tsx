import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useState } from 'react';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { AssetFlow, SimplifiedOperation } from '../../types';
import { TxCategory } from '../../types';
import { TxOperation } from '../TxOperation';
import { operationsStyles as styles } from './TxOperationsStyles';

type GroupedOperationsProps = {
  operations: SimplifiedOperation[];
  assetSummary: AssetFlow[];
  operationsInitiator: SimplifiedOperation['from'];
  operationsRecipient: SimplifiedOperation['to'];
};

export function GroupedOperations({
  operations,
  assetSummary,
  operationsInitiator,
  operationsRecipient,
}: GroupedOperationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // This function was moved from TxOperationsDrawer
  function createOperationCard(
    assetFlows: AssetFlow[],
    direction: 'in' | 'out'
  ) {
    const assetsForDirection = assetFlows.filter(
      (asset) => asset.type === direction
    );

    const isOutgoing = direction === 'out';
    return {
      type:
        assetsForDirection.length === 0
          ? TxCategory.CONTRACTCALL
          : TxCategory.SEND,
      from: direction === 'in' ? operationsInitiator : operationsRecipient,
      to: direction === 'in' ? operationsRecipient : operationsInitiator,
      assets: assetsForDirection,
      isFromCurrentAccount: isOutgoing,
      isToCurrentAccount: !isOutgoing,
      metadata: {
        depth: 0,
        operationCount: assetsForDirection.length,
        isSummary: true,
        direction,
      },
    } as SimplifiedOperation;
  }

  return (
    <>
      <Box.Flex css={styles.container}>
        <Box.Stack gap="0" css={styles.cardStyle}>
          <TxOperation operation={createOperationCard(assetSummary, 'in')} />
          <TxOperation operation={createOperationCard(assetSummary, 'out')} />
        </Box.Stack>
      </Box.Flex>
      <Box.Flex
        as="button"
        onClick={handleClick}
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
            {!isExpanded && `(+${operations.length} operations)`}
          </Text>
        </Text>
      </Box.Flex>
      {/* Expanded view with individual operations */}
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
            key={`${operation.type}-${operation.from?.address || ''}-${operation.to?.address || ''}-${index}`}
            css={styles.cardStyle}
          >
            <TxOperation operation={operation} />
          </Box.Flex>
        ))}
      </MotionBox>
    </>
  );
}
