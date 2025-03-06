import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { BN, ReceiptType } from 'fuels';
import { useMemo, useState } from 'react';
import { MotionBox } from '~/systems/Core/components/Motion';
import type { AssetFlow, SimplifiedOperation } from '../../types';
import { TxCategory } from '../../types';
import { TxOperation } from '../TxOperation';

type TxOperationsDrawerProps = {
  operations: SimplifiedOperation[];
};

// Helper to sum assets by assetId and create proper AssetFlow objects
function sumAssets(operations: SimplifiedOperation[]): AssetFlow[] {
  // First group assets by direction and assetId
  const incomingAssets: Record<string, BN> = {};
  const outgoingAssets: Record<string, BN> = {};

  // We'll need addresses for proper AssetFlow objects
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

  // Convert to proper AssetFlow objects
  const assetFlows: AssetFlow[] = [];

  // Add incoming assets
  for (const [assetId, amount] of Object.entries(incomingAssets)) {
    assetFlows.push({
      assetId,
      amount,
      from: fromAddress,
      to: toAddress,
      type: 'in',
    });
  }

  // Add outgoing assets
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

export function TxOperationsDrawer({ operations }: TxOperationsDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // const title = useMemo(() => {
  //   const count = operations.length;
  //   return `${count} Contract call${count > 1 ? 's' : ''}`;
  // }, [operations]);

  const assetSummary = useMemo(() => sumAssets(operations), [operations]);

  function createOperationCard(
    assetFlows: AssetFlow[],
    direction: 'in' | 'out'
  ) {
    const assetsForDirection = assetFlows.filter(
      (asset) => asset.type === direction
    );

    const isOutgoing = direction === 'out';
    const firstOp = operations[0];

    return {
      type: TxCategory.CONTRACTCALL,
      from: isOutgoing ? firstOp?.from : firstOp?.to,
      to: isOutgoing ? firstOp?.to : firstOp?.from,
      assets: assetsForDirection,
      isFromCurrentAccount: isOutgoing,
      isToCurrentAccount: !isOutgoing,
      metadata: {
        functionName: isOutgoing ? 'Outgoing Assets' : 'Incoming Assets',
        depth: 0,
        operationCount: assetsForDirection.length,
        isSummary: true,
        direction,
      },
    } as SimplifiedOperation;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Box css={styles.drawer} data-expanded={isExpanded}>
      {operations.length === 0 && (
        <Box css={styles.header}>
          <Text fontSize="sm" css={styles.title}>
            No root operations related to this account.
          </Text>
        </Box>
      )}

      {/* Summary view shown when collapsed */}
      {operations.length > 0 && (
        <Box.Flex css={styles.summaryContainer}>
          <Box.Stack gap="0" css={styles.cardStyle}>
            <TxOperation operation={createOperationCard(assetSummary, 'in')!} />
            <TxOperation
              operation={createOperationCard(assetSummary, 'out')!}
            />
          </Box.Stack>
        </Box.Flex>
      )}
      {operations.length > 1 && (
        <>
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
                key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
                css={styles.cardStyle}
              >
                <TxOperation operation={operation} />
              </Box.Flex>
            ))}
          </MotionBox>
        </>
      )}
    </Box>
  );
}

const styles = {
  drawer: cssObj({
    backgroundColor: '$gray5',
    borderRadius: '10px',
    // border: '1px solid $gray5',
    // boxShadow:
    //   '0px 0px 0px 1px rgba(32, 32, 32, 0.12), 0px 2px 6px -1px rgba(32, 32, 32, 0.10)',
    marginBottom: '$2',
    overflow: 'hidden',
  }),
  header: cssObj({
    display: 'flex',
    cursor: 'pointer',
    width: '100%',
    backgroundColor: 'transparent',
    padding: '0 $4',
    alignItems: 'center',
    border: 'none',
    minHeight: '36px',
  }),
  title: cssObj({
    letterSpacing: '-0.01em',
    color: '#646464',
    fontWeight: '$medium',
    fontSize: '13px',
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
    gap: '2px', // In the Design, it looks like they are touching, but that is not a border, but a shadow, so we need to add a gap
  }),
  chevron: cssObj({
    transition: 'all 0.2s ease',
    display: 'inline-block',
  }),
  // New styles for summary view
  summaryContainer: cssObj({
    padding: '2px',
  }),
  cardStyle: cssObj({
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
  }),
  assetRow: cssObj({
    alignItems: 'center',
    gap: '$2',
  }),
  assetAmount: cssObj({
    fontSize: '14px',
    fontFamily: '$mono',
  }),
  noAssets: cssObj({
    color: '$gray10',
    fontSize: '$sm',
    fontStyle: 'italic',
  }),
};
