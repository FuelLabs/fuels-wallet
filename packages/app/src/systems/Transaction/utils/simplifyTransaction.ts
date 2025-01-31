import type { Operation, TransactionRequest, TransactionSummary } from 'fuels';
import {
  BN,
  type OperationFunctionCall,
  OperationName,
  ReceiptType,
  type TransactionResultReceipt,
} from 'fuels';
import type { ContractCallMetadata, SimplifiedOperation } from '../types';
import { TxCategory } from '../types';
import type { CategorizedOperations } from '../types';
import type { SimplifiedTransaction } from '../types.tsx';

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

function getReceiptDepth(
  allReceipts: TransactionResultReceipt[],
  receiptIndex: number
): number {
  let depth = 0;

  for (let i = 0; i < receiptIndex; i++) {
    const r = allReceipts[i];
    if (r.type === ReceiptType.Call) depth++;
    if (r.type === ReceiptType.ReturnData && depth > 0) depth--;
    if (r.type === ReceiptType.ScriptResult) depth = 0;
  }

  return depth;
}

function transformOperation(
  operation: Operation,
  allReceipts: TransactionResultReceipt[],
  currentAccount?: string,
  receiptIndex?: number
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
  const receipt = receipts[0];

  const depth =
    receipt && typeof receiptIndex === 'number'
      ? getReceiptDepth(allReceipts, receiptIndex)
      : 0;

  const isFromCurrentAccount = currentAccount
    ? from?.address === currentAccount
    : false;

  const fromAddress = from
    ? { address: from.address, type: from.type }
    : undefined;
  const toAddress = to ? { address: to.address, type: to.type } : undefined;

  if (name === OperationName.contractCall && calls.length > 0) {
    const call = calls[0] as OperationFunctionCall;
    const metadata: ContractCallMetadata = {
      contractId: to?.address,
      functionName: call.functionName,
      functionData: call,
      amount: call.amount ? new BN(call.amount) : undefined,
      assetId: call.assetId,
      depth,
      receiptType: receipt?.type,
    };

    return {
      type,
      from: fromAddress!,
      to: toAddress!,
      isFromCurrentAccount,
      metadata,
    };
  }

  if (assetsSent.length > 0) {
    const asset = assetsSent[0];
    return {
      type,
      from: fromAddress!,
      to: toAddress!,
      isFromCurrentAccount,
      amount: new BN(asset.amount),
      assetId: asset.assetId,
      metadata: {
        depth,
      },
    };
  }

  return {
    type,
    from: fromAddress!,
    to: toAddress!,
    isFromCurrentAccount,
    metadata: {
      depth,
    },
  };
}

export function transformOperations(
  summary: TransactionSummary,
  currentAccount?: string
): SimplifiedOperation[] {
  if (!summary.operations) return [];

  const allReceipts = summary.receipts || [];

  const operations = summary.operations.map((op) => {
    const operationReceipt = op.receipts?.[0];
    if (!operationReceipt) return transformOperation(op, [], currentAccount);

    const receiptIndex = allReceipts.findIndex(
      (r) =>
        r.type === operationReceipt.type &&
        r.pc === operationReceipt.pc &&
        r.is === operationReceipt.is
    );

    if (receiptIndex === -1) {
      console.warn('Could not find operation receipt in full receipt list');
      return transformOperation(op, [], currentAccount);
    }

    return transformOperation(op, allReceipts, currentAccount, receiptIndex);
  });

  operations.sort(
    (a, b) => (a.metadata?.depth || 0) - (b.metadata?.depth || 0)
  );

  return operations;
}

function groupSimilarOperations(
  operations: SimplifiedOperation[]
): SimplifiedOperation[] {
  const groupedOps = new Map<string, SimplifiedOperation>();

  for (const op of operations) {
    const key = [
      op.type,
      op.from.address,
      op.to.address,
      op.metadata.functionName || '',
    ].join('|');

    const existing = groupedOps.get(key);
    if (!existing) {
      const newOp = {
        ...op,
        metadata: {
          ...op.metadata,
          operationCount: 1,
          groupedAssets:
            op.amount && op.assetId
              ? {
                  [op.assetId]: {
                    amount: op.amount,
                    assetId: op.assetId,
                    assetAmount: op.assetAmount,
                  },
                }
              : undefined,
        },
      };
      groupedOps.set(key, newOp);
      continue;
    }

    const groupedAssets = existing.metadata.groupedAssets || {};
    if (op.amount && op.assetId) {
      const existingAsset = groupedAssets[op.assetId];
      groupedAssets[op.assetId] = {
        amount: existingAsset ? existingAsset.amount.add(op.amount) : op.amount,
        assetId: op.assetId,
        assetAmount: op.assetAmount,
      };
    }

    existing.metadata.operationCount =
      (existing.metadata.operationCount || 1) + 1;
    existing.metadata.groupedAssets = groupedAssets;
  }

  return Array.from(groupedOps.values());
}

function categorizeOperations(
  operations: SimplifiedOperation[],
  currentAccount?: string
): CategorizedOperations {
  const main: SimplifiedOperation[] = [];
  const otherRoot: SimplifiedOperation[] = [];
  const intermediate: SimplifiedOperation[] = [];

  for (const op of operations) {
    const depth = op.metadata?.depth || 0;
    const isTransfer = op.type === TxCategory.SEND;
    const isFromCurrentAccount =
      currentAccount &&
      op.from.address.toLowerCase() === currentAccount.toLowerCase();
    const isToCurrentAccount =
      currentAccount &&
      op.to.address.toLowerCase() === currentAccount.toLowerCase();

    if (isTransfer) {
      main.push(op);
      continue;
    }

    if (depth === 0) {
      if (isFromCurrentAccount || isToCurrentAccount) {
        main.push(op);
      } else {
        otherRoot.push(op);
      }
      continue;
    }

    intermediate.push(op);
  }

  // Group similar operations in each category
  return {
    mainOperations: groupSimilarOperations(main),
    otherRootOperations: groupSimilarOperations(otherRoot),
    intermediateOperations: groupSimilarOperations(intermediate),
  };
}

export function simplifyTransaction(
  summary: TransactionSummary,
  request?: TransactionRequest,
  currentAccount?: string
): SimplifiedTransaction {
  console.log('summary', summary);
  const operations = transformOperations(summary, currentAccount);
  const categorizedOperations = categorizeOperations(
    operations,
    currentAccount
  );

  const requestWithOrigin = request as TransactionRequestWithOrigin;
  const origin = requestWithOrigin?.origin;
  const favicon = requestWithOrigin?.favIconUrl;

  return {
    id: summary.id,
    operations,
    categorizedOperations,
    timestamp: summary.time ? new Date(summary.time) : undefined,
    fee: {
      total: new BN(summary.fee || 0),
      network: new BN(summary.fee || 0).sub(new BN(request?.tip || 0)),
      tip: new BN(request?.tip || 0),
      gasUsed: new BN(summary.gasUsed || 0),
      gasPrice: new BN(0),
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
