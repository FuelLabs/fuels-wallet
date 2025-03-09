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
};
function sumAssets(operations: SimplifiedOperation[]): AssetFlow[] {
  const incomingAssets: Record<string, BN> = {};
  const outgoingAssets: Record<string, BN> = {};

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
    const fromOp = operations.find(
      (op) =>
        !op.isFromCurrentAccount &&
        op.assets?.some((a) => a.assetId === assetId)
    );

    assetFlows.push({
      assetId,
      amount,
      from: fromOp?.from?.address || '',
      to: fromOp?.to?.address || '',
      type: 'in',
    });
  }

  for (const [assetId, amount] of Object.entries(outgoingAssets)) {
    const toOp = operations.find(
      (op) =>
        op.isFromCurrentAccount && op.assets?.some((a) => a.assetId === assetId)
    );

    assetFlows.push({
      assetId,
      amount,
      from: toOp?.from?.address || '',
      to: toOp?.to?.address || '',
      type: 'out',
    });
  }

  return assetFlows;
}

export function GroupedOperations({ operations }: GroupedOperationsProps) {
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
      (asset) => asset.type !== direction
    );

    const userToContractOp = operations.find((op) => op.isFromCurrentAccount);

    return {
      type:
        assetsForDirection.length === 0
          ? TxCategory.CONTRACTCALL
          : TxCategory.SEND,
      from: userToContractOp?.from,
      to: direction === 'in' ? userToContractOp?.to : userToContractOp?.from,
      assets: assetsForDirection,
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
