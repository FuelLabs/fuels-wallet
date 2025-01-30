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
  receipt: TransactionResultReceipt,
  allReceipts: TransactionResultReceipt[]
): number {
  const receiptIndex = allReceipts.findIndex((r) => r === receipt);
  if (receiptIndex === -1) return 0;

  let depth = 0;
  for (let i = 0; i < receiptIndex; i++) {
    const r = allReceipts[i];
    if (r.type === ReceiptType.Call) depth++;
    if (r.type === ReceiptType.ReturnData && depth > 0) depth--;
    if (
      r.type === ReceiptType.ScriptResult &&
      allReceipts[i - 1]?.type !== ReceiptType.Return
    )
      depth = 0;
  }

  return depth;
}

function transformOperation(
  operation: Operation,
  allReceipts: TransactionResultReceipt[],
  currentAccount?: string
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
  const depth = receipt ? getReceiptDepth(receipt, allReceipts) : 0;

  const isFromCurrentAccount = currentAccount
    ? from?.address === currentAccount
    : false;

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
      from: from?.address || '',
      to: to?.address || '',
      isFromCurrentAccount,
      metadata,
    };
  }

  if (assetsSent.length > 0) {
    const asset = assetsSent[0];
    return {
      type,
      from: from?.address || '',
      to: to?.address || '',
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
    from: from?.address || '',
    to: to?.address || '',
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

  // Get all receipts from all operations
  const allReceipts = summary.operations.flatMap((op) => op.receipts || []);

  console.log('All receipts:', allReceipts);

  // Transform operations with receipt depth information
  const operations = summary.operations.map((op) =>
    transformOperation(op, allReceipts, currentAccount)
  );

  // Sort by depth to maintain visual hierarchy
  operations.sort(
    (a, b) => (a.metadata?.depth || 0) - (b.metadata?.depth || 0)
  );

  console.log('Transformed operations with depth:', operations);
  return operations;
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
      currentAccount && op.from.toLowerCase() === currentAccount.toLowerCase();
    const isToCurrentAccount =
      currentAccount && op.to.toLowerCase() === currentAccount.toLowerCase();

    // All transfers go to main list
    if (isTransfer) {
      main.push(op);
      continue;
    }

    // Contract calls at root level (depth 0)
    if (depth === 0) {
      // If related to current account, show in main list
      if (isFromCurrentAccount || isToCurrentAccount) {
        main.push(op);
      } else {
        otherRoot.push(op);
      }
      continue;
    }

    // All other operations (intermediate contract calls)
    intermediate.push(op);
  }

  return {
    mainOperations: main,
    otherRootOperations: otherRoot,
    intermediateOperations: intermediate,
  };
}

export function simplifyTransaction(
  summary: TransactionSummary,
  request?: TransactionRequest,
  currentAccount?: string
): SimplifiedTransaction {
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
