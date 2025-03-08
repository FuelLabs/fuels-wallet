import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { BN } from 'fuels';
import { useMemo, useState } from 'react';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { AssetFlow, SimplifiedOperation } from '../../types';
import { TxCategory } from '../../types';
import { TxOperation } from '../TxOperation';
import { operationsStyles as styles } from './TxOperationsStyles';

type GroupedOperationsProps = {
  operations: SimplifiedOperation[];
  operationsInitiator: SimplifiedOperation['from'];
  operationsRecipient: SimplifiedOperation['to'];
};
function sumAssets(operations: SimplifiedOperation[]): AssetFlow[] {
  const incomingAssets: Record<string, BN> = {};
  const outgoingAssets: Record<string, BN> = {};

  let fromAddress = '';
  let toAddress = '';
  if (operations.length > 0) {
    const firstOp = operations[0];
    fromAddress = firstOp.from?.address || '';
    toAddress = firstOp.to?.address || '';
  }

  for (const op of operations) {
    if (!op.assets?.length) continue;

    for (const asset of op.assets) {
      const { assetId, amount } = asset;
      const direction = op.isFromCurrentAccount
        ? outgoingAssets
        : incomingAssets;

      if (!direction[assetId]) {
        direction[assetId] = new BN(0);
      }
      direction[assetId] = direction[assetId].add(amount);
    }
  }

  const assetFlows: AssetFlow[] = [];

  for (const [assetId, amount] of Object.entries(incomingAssets)) {
    assetFlows.push({
      assetId,
      amount,
      from: fromAddress,
      to: toAddress,
      type: 'in',
    });
  }

  for (const [assetId, amount] of Object.entries(outgoingAssets)) {
    assetFlows.push({
      assetId,
      amount,
      from: toAddress,
      to: fromAddress,
      type: 'out',
    });
  }

  return assetFlows;
}
export function GroupedOperations({
  operations,
  operationsInitiator,
  operationsRecipient,
}: GroupedOperationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const assetSummary = useMemo(() => sumAssets(operations), [operations]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

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
