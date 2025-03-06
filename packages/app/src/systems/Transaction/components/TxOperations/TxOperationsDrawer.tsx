import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text, useFuelTheme } from '@fuel-ui/react';
import { BN } from 'fuels';
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

let _isDark = false;

export function TxOperationsDrawer({ operations }: TxOperationsDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { current: theme } = useFuelTheme();
  _isDark = theme === 'dark';
  const assetSummary = useMemo(() => sumAssets(operations), [operations]);
  // to be able to show a combined view, all root main operations should have the same initiator and recipient
  const operationsInitiator = operations[0]?.from;
  const operationsRecipient = operations[0]?.to;

  const allOperationsHaveSameInitiatorAndRecipient = operations.every(
    (operation) =>
      operation.from?.address === operationsInitiator?.address &&
      operation.to?.address === operationsRecipient?.address
  );

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const renderOperations = () => {
    if (operations.length === 0) {
      return (
        <Box css={styles.header}>
          <Text fontSize="sm" css={styles.title}>
            No root operations related to this account.
          </Text>
        </Box>
      );
    }
    if (operations.length === 1) {
      return (
        <Box css={styles.container}>
          <Box.Flex css={styles.cardStyle}>
            <TxOperation operation={operations[0]} />
          </Box.Flex>
        </Box>
      );
    }
    if (operations.length > 1 && allOperationsHaveSameInitiatorAndRecipient) {
      return (
        <>
          <Box.Flex css={styles.container}>
            <Box.Stack gap="0" css={styles.cardStyle}>
              <TxOperation
                operation={createOperationCard(assetSummary, 'in')!}
              />
              <TxOperation
                operation={createOperationCard(assetSummary, 'out')!}
              />
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
                key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
                css={styles.cardStyle}
              >
                <TxOperation operation={operation} />
              </Box.Flex>
            ))}
          </MotionBox>
        </>
      );
    }
    return (
      <Box css={styles.container}>
        {operations.map((operation, index) => (
          <TxOperation
            key={`${operation.type}-${operation?.from}-${operation.to}-${index}`}
            operation={operation}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box css={styles.drawer} data-expanded={isExpanded}>
      {renderOperations()}
    </Box>
  );
}

const styles = {
  drawer: cssObj({
    bg: '$gray5',
    borderRadius: '10px',
    marginBottom: '$2',
    overflow: 'hidden',
    'html[class="fuel_dark-theme"] &': {
      bg: '$gray2',
      border: '1px solid $gray3',
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
  container: cssObj({
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
