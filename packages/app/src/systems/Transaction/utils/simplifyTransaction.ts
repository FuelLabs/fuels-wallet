import type { Operation, TransactionRequest, TransactionSummary } from 'fuels';
import {
  type OperationFunctionCall,
  OperationName,
  TransactionStatus,
  bn,
} from 'fuels';
import type {
  ContractCallMetadata,
  SimplifiedOperation,
  SwapMetadata,
} from '../types';
import { TxCategory } from '../types';
import type { SimplifiedFee, SimplifiedTransaction } from '../types.tsx';

// Type for transaction request with optional origin properties
type TransactionRequestWithOrigin = TransactionRequest & {
  origin?: string;
  favIconUrl?: string;
};

function getOperationType(operation: Operation): TxCategory {
  const { name } = operation;

  switch (name) {
    case OperationName.transfer:
      return operation.to ? TxCategory.SEND : TxCategory.RECEIVE;
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
  const type = getOperationType(operation);

  // Determine if this operation is from the current account
  const isFromCurrentAccount = currentAccount
    ? from?.address === currentAccount
    : false;

  // For contract calls, use the contract information
  if (name === OperationName.contractCall && calls.length > 0) {
    const call = calls[0] as OperationFunctionCall;
    const metadata: ContractCallMetadata = {
      contractId: to?.address,
      functionName: call.functionName,
      functionData: call,
      amount: call.amount ? bn(call.amount) : undefined,
      assetId: call.assetId,
    };

    return {
      type,
      groupId: `${type}-${to?.address}`,
      from: from?.address || '',
      to: to?.address || '',
      isFromCurrentAccount,
      metadata,
    };
  }

  // For transfers, use the asset information
  if (assetsSent.length > 0) {
    const asset = assetsSent[0];
    return {
      type,
      groupId: `${type}-${asset.assetId}`,
      from: from?.address || '',
      to: to?.address || '',
      amount: asset.amount ? bn(asset.amount) : undefined,
      assetId: asset.assetId,
      isFromCurrentAccount,
    };
  }

  // Default case
  return {
    type,
    groupId: `${type}-${to?.address}`,
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
  // Group operations by type, asset, and destination
  const groups = operations.reduce(
    (acc, op) => {
      let key: string;
      if (op.type === TxCategory.CONTRACTCALL) {
        key = `${op.type}-${op.to}`; // Group contract calls by their target contract
      } else if (
        (op.type === TxCategory.SEND || op.type === TxCategory.RECEIVE) &&
        op.assetId
      ) {
        key = `${op.type}-${op.assetId}-${op.to}`; // Group transfers by type, asset ID, and destination
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
    const metadata = firstOp.metadata as ContractCallMetadata;

    // For contract calls, mark as a group
    if (firstOp.type === TxCategory.CONTRACTCALL) {
      return {
        ...firstOp,
        metadata: {
          ...metadata,
          isContractCallGroup: true,
          operationCount: group.length,
          totalAmount: group.reduce((sum, op) => {
            const opMetadata = op.metadata as ContractCallMetadata;
            return opMetadata?.amount ? sum.add(opMetadata.amount) : sum;
          }, bn(0)),
        },
      };
    }

    // For transfers, sum the amounts if they're the same asset
    return {
      ...firstOp,
      metadata: {
        operationCount: group.length,
        totalAmount: group.every(
          (op) => op.amount && op.assetId === firstOp.assetId
        )
          ? group.reduce((sum, op) => sum.add(op.amount!), bn(0))
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
  console.log('summary', summary);

  const operations = transformOperations(summary, currentAccount);

  // Group similar operations
  const groupedOperations = groupSimilarOperations(operations);

  // TODO Sort operations (current account's operations first)

  // Get origin info from the request context if available
  const requestWithOrigin = request as TransactionRequestWithOrigin;
  const origin = requestWithOrigin?.origin;
  const favicon = requestWithOrigin?.favIconUrl;

  const simplifiedTransaction: SimplifiedTransaction = {
    id: summary.id,
    operations: groupedOperations,
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

  console.log('simplifiedTransaction', simplifiedTransaction);

  return simplifiedTransaction;
}
