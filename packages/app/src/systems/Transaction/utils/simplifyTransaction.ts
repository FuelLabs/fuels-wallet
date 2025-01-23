import type { Operation, TransactionRequest, TransactionSummary } from 'fuels';
import {
  type OperationFunctionCall,
  OperationName,
  ReceiptType,
  type TransactionResultReceipt,
  TransactionStatus,
  bn,
} from 'fuels';
import type { ContractCallMetadata, SimplifiedOperation } from '../types';
import { TxCategory } from '../types';
import type { SimplifiedFee, SimplifiedTransaction } from '../types.tsx';

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

function isRootOperation(_operation: Operation): boolean {
  return false;
}

function getReceiptDepth(
  receipt: TransactionResultReceipt,
  allReceipts: TransactionResultReceipt[]
): number {
  // For now, use a simple depth calculation based on receipt order
  // We can enhance this later when we have better receipt hierarchy info
  const index = allReceipts.findIndex((r) => r === receipt);
  return index > 0 ? 1 : 0;
}

function transformOperation(
  operation: Operation,
  currentAccount?: string,
  allReceipts: TransactionResultReceipt[] = []
): SimplifiedOperation {
  const {
    name,
    from,
    to,
    assetsSent = [],
    calls = [],
    receipts = [],
  } = operation;
  const type = getOperationType(operation);
  const isRoot = isRootOperation(operation);

  // Calculate depth based on receipts
  const depth = receipts.length
    ? Math.min(...receipts.map((r) => getReceiptDepth(r, allReceipts)))
    : 0;

  const isFromCurrentAccount = currentAccount
    ? from?.address === currentAccount
    : false;

  if (name === OperationName.contractCall && calls.length > 0) {
    const call = calls[0] as OperationFunctionCall;
    const metadata: ContractCallMetadata = {
      contractId: to?.address,
      functionName: call.functionName,
      functionData: call,
      amount: call.amount ? bn(call.amount) : undefined,
      assetId: call.assetId,
      isRoot,
      receipts,
      depth,
    };

    return {
      type,
      groupId: `${type}-${to?.address}`,
      from: from?.address || '',
      to: to?.address || '',
      isFromCurrentAccount,
      isRoot,
      depth,
      metadata,
    };
  }

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
      isRoot,
      depth,
      metadata: {
        receipts,
        depth,
      },
    };
  }

  return {
    type,
    groupId: `${type}-${to?.address}`,
    from: from?.address || '',
    to: to?.address || '',
    isFromCurrentAccount,
    isRoot,
    depth,
    metadata: {
      receipts,
      depth,
    },
  };
}

export function transformOperations(
  summary: TransactionSummary,
  currentAccount?: string
): SimplifiedOperation[] {
  if (!summary.operations) return [];

  // Get all receipts from all operations for depth calculation
  const allReceipts = summary.operations.flatMap((op) => op.receipts || []);

  // Transform all operations but only keep ones relevant to current account
  const operations = summary.operations
    .filter((op) => {
      if (!currentAccount) return true;
      const currentAccountLower = currentAccount.toLowerCase();

      // Check operation addresses
      const opTo = op.to?.address?.toLowerCase();
      const opFrom = op.from?.address?.toLowerCase();
      const isOperationRelevant =
        opTo === currentAccountLower || opFrom === currentAccountLower;

      // Check receipt addresses
      const hasRelevantReceipt = op.receipts?.some((receipt) => {
        // Only check transfer receipts for now as they have from/to fields
        if (
          receipt.type === ReceiptType.Transfer ||
          receipt.type === ReceiptType.TransferOut
        ) {
          const transfer = receipt as { to?: string; from?: string };
          return (
            transfer.to?.toLowerCase() === currentAccountLower ||
            transfer.from?.toLowerCase() === currentAccountLower
          );
        }
        return false;
      });

      // Show operation if either the operation itself or any of its receipts involve the current account
      return isOperationRelevant || hasRelevantReceipt;
    })
    .map((op) => {
      const transformed = transformOperation(op, currentAccount, allReceipts);
      console.log('Operation:', {
        type: op.name,
        receipts: op.receipts?.map((r) => r.type),
        isRoot: transformed.isRoot,
        depth: transformed.depth,
        from: op.from?.address,
        to: op.to?.address,
        receiptTypes: op.receipts?.map((r) => r.type),
      });
      return transformed;
    });

  // Sort operations by depth
  return operations.sort((a, b) => (a.depth || 0) - (b.depth || 0));
}

function getGroupKey(op: SimplifiedOperation): string {
  const base = `${op.type}-${op.to}`;
  if (op.type === TxCategory.CONTRACTCALL) return base;
  return op.assetId ? `${base}-${op.assetId}` : base;
}

export function groupSimilarOperations(
  operations: SimplifiedOperation[]
): SimplifiedOperation[] {
  const groups = operations.reduce(
    (acc, op) => {
      const key = getGroupKey(op);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(op);
      return acc;
    },
    {} as Record<string, SimplifiedOperation[]>
  );

  return Object.values(groups).map((group) => {
    if (group.length === 1) return group[0];

    const firstOp = group[0];
    const metadata = firstOp.metadata as ContractCallMetadata;

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

export function simplifyTransaction(
  summary: TransactionSummary,
  request?: TransactionRequest,
  currentAccount?: string
): SimplifiedTransaction {
  console.log('summary', summary);
  const operations = transformOperations(summary, currentAccount);
  const groupedOperations = groupSimilarOperations(operations);

  const requestWithOrigin = request as TransactionRequestWithOrigin;
  const origin = requestWithOrigin?.origin;
  const favicon = requestWithOrigin?.favIconUrl;

  return {
    id: summary.id,
    operations: groupedOperations,
    timestamp: summary.time ? new Date(summary.time) : undefined,
    fee: {
      total: bn(summary.fee || 0),
      network: bn(summary.fee || 0).sub(bn(request?.tip || 0)),
      tip: bn(request?.tip || 0),
      gasUsed: bn(summary.gasUsed || 0),
      gasPrice: bn(0), // This will be calculated later when we have access to the provider
    },
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
