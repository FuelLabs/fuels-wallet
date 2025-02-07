import type {
  Operation,
  TransactionRequest,
  TransactionResult,
  TransactionSummary,
} from 'fuels';
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
    case OperationName.contractCreated:
      return TxCategory.CONTRACTCREATED;
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
  const { name, from, to, assetsSent = [], calls = [] } = operation;

  const type = getOperationType(operation);
  let depth = 0;
  let receipt = null;

  // Safely check for receipts property
  try {
    // @ts-ignore - receipts will exist in future SDK versions
    const receipts = operation.receipts || [];
    receipt = receipts[0];
    if (receipt && typeof receiptIndex === 'number' && allReceipts.length > 0) {
      depth = getReceiptDepth(allReceipts, receiptIndex);
    }
  } catch (error) {
    console.warn(
      'Could not access operation receipts, defaulting depth to 0',
      error
    );
    depth = 0;
  }

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
    return {
      type,
      from: fromAddress!,
      to: toAddress!,
      isFromCurrentAccount,
      assets: assetsSent.map((asset) => ({
        amount: new BN(asset.amount),
        assetId: asset.assetId,
      })),
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
    // @ts-ignore - receipts will exist in future SDK versions
    const operationReceipt = op.receipts?.[0];
    if (!operationReceipt) return transformOperation(op, [], currentAccount);

    const receiptIndex = allReceipts.findIndex((r) => {
      // Only compare pc and is if they exist on both receipts
      const pcMatch =
        'pc' in r && 'pc' in operationReceipt
          ? r.pc === operationReceipt.pc
          : true;

      const isMatch =
        'is' in r && 'is' in operationReceipt
          ? r.is === operationReceipt.is
          : true;

      return r.type === operationReceipt.type && pcMatch && isMatch;
    });

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
  // Group similar operations
  const groups = operations.reduce(
    (acc, op) => {
      const key = `${op.type}-${op.from.address}-${op.to.address}-${op.metadata?.depth}`;
      if (!acc[key]) {
        acc[key] = {
          ...op,
          metadata: {
            ...op.metadata,
            operationCount: 1,
            groupedAssets: {},
            childOperations: [op],
          },
        };
      } else {
        // Combine assets from same type of operations
        for (const asset of op.assets || []) {
          const existing = acc[key].metadata.groupedAssets![asset.assetId];
          if (existing) {
            existing.amount = existing.amount.add(asset.amount);
          } else {
            acc[key].metadata.groupedAssets![asset.assetId] = {
              amount: asset.amount,
              assetId: asset.assetId,
            };
          }
        }
        acc[key].metadata.childOperations = [
          ...(acc[key].metadata.childOperations || []),
          op,
        ];
        acc[key].metadata.operationCount! += 1;
      }
      return acc;
    },
    {} as Record<string, SimplifiedOperation>
  );

  return Object.values(groups);
}

function categorizeOperations(
  operations: SimplifiedOperation[],
  currentAccount?: string
): CategorizedOperations {
  const main: SimplifiedOperation[] = [];
  const otherRoot: SimplifiedOperation[] = [];
  const intermediate: SimplifiedOperation[] = [];

  // First pass: separate operations
  for (const op of operations) {
    const depth = op.metadata?.depth || 0;
    const isTransfer =
      op.type === TxCategory.SEND || op.type === TxCategory.RECEIVE;
    const isFromCurrentAccount =
      currentAccount &&
      op.from.address.toLowerCase() === currentAccount.toLowerCase();
    const isToCurrentAccount =
      currentAccount &&
      op.to.address.toLowerCase() === currentAccount.toLowerCase();

    if (depth === 0) {
      if (isTransfer) {
        if (isFromCurrentAccount || isToCurrentAccount) {
          main.push(op);
        } else {
          otherRoot.push(op);
        }
      } else if (isFromCurrentAccount || isToCurrentAccount) {
        main.push(op);
      } else {
        otherRoot.push(op);
      }
      continue;
    }

    intermediate.push(op);
  }

  // Sort main operations: from user first, then to user
  main.sort((a, b) => {
    const aFromUser =
      currentAccount &&
      a.from.address.toLowerCase() === currentAccount.toLowerCase();
    const bFromUser =
      currentAccount &&
      b.from.address.toLowerCase() === currentAccount.toLowerCase();

    if (aFromUser && !bFromUser) return -1;
    if (!aFromUser && bFromUser) return 1;
    return 0;
  });

  // set all main operations to depth 0
  for (const op of main) {
    op.metadata.depth = 0;
  }

  // Group similar operations in each category
  return {
    mainOperations: groupSimilarOperations(main),
    otherRootOperations: groupSimilarOperations(otherRoot),
    intermediateOperations: groupSimilarOperations(intermediate),
  };
}

export function simplifyTransaction(
  summary: TransactionSummary | TransactionResult,
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

  const simplifiedTransaction = {
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
  console.log('simplifiedTransaction', simplifiedTransaction);
  return simplifiedTransaction;
}
