import type { Operation, TransactionRequest, TransactionSummary } from 'fuels';
import {
  type OperationFunctionCall,
  OperationName,
  TransactionStatus,
  bn,
} from 'fuels';
import {
  type ContractCallMetadata,
  type SimplifiedFee,
  type SimplifiedOperation,
  type SimplifiedTransaction,
  type SwapMetadata,
  TxCategory,
} from '../types';

// Type for transaction request with optional origin properties
type TransactionRequestWithOrigin = TransactionRequest & {
  origin?: string;
  favIconUrl?: string;
};

function getOperationType(operation: Operation): TxCategory {
  const { name } = operation;

  switch (name) {
    case OperationName.transfer:
      return TxCategory.SEND;
    case OperationName.contractCall:
      return TxCategory.CONTRACTCALL;
    case OperationName.script:
      return TxCategory.SCRIPT;
    default:
      return TxCategory.SEND;
  }
}

function transformOperation(
  operation: Operation,
  currentAccount?: string
): SimplifiedOperation {
  const { name, from, to, assetsSent = [], calls = [] } = operation;

  // Determine if this operation is from the current account
  const isFromCurrentAccount = currentAccount
    ? from?.address === currentAccount
    : false;

  // For contract calls, use the contract information
  if (name === OperationName.contractCall && calls.length > 0) {
    const call = calls[0] as OperationFunctionCall; // Take first call for now, we'll group them later
    return {
      type: TxCategory.CONTRACTCALL,
      from: from?.address || '',
      to: to?.address || '',
      isFromCurrentAccount,
      metadata: {
        contractId: to?.address,
        functionName: call.functionName,
        functionData: call,
        amount: call.amount ? bn(call.amount) : undefined,
        assetId: call.assetId,
      },
    };
  }

  // For transfers, use the asset information
  if (assetsSent.length > 0) {
    const asset = assetsSent[0]; // Take first asset for now, we'll group them later
    return {
      type: TxCategory.SEND,
      from: from?.address || '',
      to: to?.address || '',
      amount: asset.amount ? bn(asset.amount) : undefined,
      assetId: asset.assetId,
      isFromCurrentAccount,
    };
  }

  // Default case
  return {
    type: getOperationType(operation),
    from: from?.address || '',
    to: to?.address || '',
    isFromCurrentAccount,
  };
}

export function transformOperations(
  summary: TransactionSummary,
  currentAccount?: string
): SimplifiedOperation[] {
  if (!summary.operations) return [];

  return summary.operations.map((op) => transformOperation(op, currentAccount));
}

export function groupSimilarOperations(
  operations: SimplifiedOperation[]
): SimplifiedOperation[] {
  const result: SimplifiedOperation[] = [];
  const used = new Set<number>();

  // First pass: detect swaps
  for (let i = 0; i < operations.length; i++) {
    if (used.has(i)) continue;

    const current = operations[i];
    if (current.type === TxCategory.SEND && i + 1 < operations.length) {
      const next = operations[i + 1];
      // Check if this is a swap:
      // 1. Both operations are sends
      // 2. The sender of the first is the receiver of the second
      // 3. The receiver of the first is the sender of the second
      if (
        next.type === TxCategory.SEND &&
        current.from === next.to &&
        current.to === next.from
      ) {
        // Combine the two operations into one swap
        result.push({
          ...current,
          metadata: {
            isSwap: true,
            receiveAmount: next.amount?.toString() || '0',
            receiveAssetId: next.assetId || '',
          } as SwapMetadata,
        });
        used.add(i);
        used.add(i + 1);
        continue;
      }
    }

    if (!used.has(i)) {
      result.push(current);
      used.add(i);
    }
  }

  // Second pass: group similar non-swap operations
  const groups = result.reduce(
    (acc, op) => {
      let key: string;
      if (op.type === TxCategory.CONTRACTCALL) {
        key = `${op.type}-${op.to}`; // Group contract calls by their target contract
      } else if (op.type === TxCategory.SEND && op.assetId) {
        key = `${op.type}-${op.assetId}`; // Group transfers by asset ID
      } else {
        key = `${op.type}-${op.to}`; // Other operations grouped by type and destination
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(op);
      return acc;
    },
    {} as Record<string, SimplifiedOperation[]>
  );

  // Combine operations in each group
  return Object.values(groups).map((group) => {
    if (group.length === 1) return group[0];

    const firstOp = group[0];
    // Combine similar operations
    return {
      ...firstOp,
      groupId:
        firstOp.type === TxCategory.SEND && firstOp.assetId
          ? `group-${firstOp.type}-${firstOp.assetId}`
          : `group-${firstOp.type}-${firstOp.to}`,
      metadata: {
        ...firstOp.metadata,
        operationCount: group.length,
        // Sum amounts if they exist and are the same asset
        totalAmount: group.every(
          (op) => op.amount && op.assetId === firstOp.assetId
        )
          ? group.reduce((sum, op) => sum.add(op.amount!), firstOp.amount!)
          : undefined,
      },
    };
  });
}

export function simplifyFee(
  summary: TransactionSummary,
  request?: TransactionRequest
): SimplifiedFee {
  const tip = request?.tip || bn(0);
  return {
    total: summary.fee || bn(0),
    network: (summary.fee || bn(0)).sub(tip),
    tip,
    gasUsed: summary.gasUsed || bn(0),
    gasPrice: bn(0), // This will be calculated later when we have access to the provider
  };
}

function deriveStatus(summary: TransactionSummary): TransactionStatus {
  if (summary.isStatusSuccess) return TransactionStatus.success;
  if (summary.isStatusFailure) return TransactionStatus.failure;
  if (summary.isStatusPending) return TransactionStatus.submitted;
  return TransactionStatus.submitted; // Default to submitted if no status is set
}

export function simplifyTransaction(
  summary: TransactionSummary,
  request?: TransactionRequest,
  currentAccount?: string
): SimplifiedTransaction {
  // Transform operations
  const operations = transformOperations(summary, currentAccount);

  // Group similar operations
  const groupedOperations = groupSimilarOperations(operations);

  // Sort operations (current account's operations first)
  const sortedOperations = groupedOperations.sort((a, b) => {
    if (a.isFromCurrentAccount && !b.isFromCurrentAccount) return -1;
    if (!a.isFromCurrentAccount && b.isFromCurrentAccount) return 1;
    return 0;
  });

  // Get origin info from the request context if available
  const requestWithOrigin = request as TransactionRequestWithOrigin;
  const origin = requestWithOrigin?.origin;
  const favicon = requestWithOrigin?.favIconUrl;

  return {
    id: summary.id,
    operations: sortedOperations,
    status: deriveStatus(summary),
    timestamp: summary.time ? new Date(summary.time) : undefined,
    fee: simplifyFee(summary, request),
    origin: origin
      ? {
          name: origin,
          favicon,
          url: origin,
        }
      : undefined,
    original: {
      summary,
      request,
    },
  };
}
