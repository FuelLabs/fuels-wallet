// @ts-nocheck
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
import type {
  BidirectionalInfo,
  ContractCallMetadata,
  SimplifiedOperation,
} from '../types';
import { TxCategory } from '../types';
import type { CategorizedOperations, SimplifiedTransaction } from '../types';

type TransactionRequestWithOrigin = TransactionRequest & {
  origin?: string;
  favIconUrl?: string;
};

// Define proper receipt data type
type ParsedReceiptData = {
  indent: number;
  arrow: string;
  type: number;
  data: TransactionResultReceipt;
};

function getOperationType(operation: Operation): TxCategory {
  const { name } = operation;

  switch (name) {
    case OperationName.transfer:
      return operation.to ? TxCategory.SEND : TxCategory.RECEIVE;
    case OperationName.contractCall:
      return TxCategory.CONTRACTCALL;
    case OperationName.contractCreated:
      return TxCategory.CONTRACTCREATED;
    default:
      return TxCategory.SEND;
  }
}

function parseReceipts(receipts) {
  try {
    if (!receipts) return [];
    let indent = 0;
    const flow = [];
    for (const [index, item] of receipts.entries()) {
      const type = item.type;
      const previousItem = receipts[index - 1] || {};
      if (
        previousItem.type !== ReceiptType.Return &&
        type === ReceiptType.ScriptResult
      )
        indent = 0;
      const arrow = `${'-'.repeat(indent + 1)}>`;
      flow.push({ indent, arrow, type, data: item });
      if ([ReceiptType.Call, ReceiptType.Return].includes(type)) indent++;
      if ([ReceiptType.ReturnData].includes(type) && indent > 0) indent--;
    }
    return flow;
  } catch (error) {
    console.error('Error parsing receipts', error);
    return [];
  }
}

function transformOperation(
  operation: Operation,
  // biome-ignore lint/correctness/noUnusedVariables: kept for compatibility
  _allReceipts: TransactionResultReceipt[],
  currentAccount?: string,
  // biome-ignore lint/correctness/noUnusedVariables: kept for compatibility
  _receiptIndex?: number,
  parsedReceipts?: ParsedReceiptData[]
): SimplifiedOperation {
  const { name, from, to, assetsSent = [], calls = [] } = operation;

  // @ts-ignore - receipts will exist in future SDK versions
  const operationReceipt = operation.receipts?.[0];
  const operationType = getOperationType(operation);
  // Build base operation object
  const baseOperation = {
    type: operationType,
    from: from ? { address: from.address, type: from.type } : undefined,
    to: to ? { address: to.address, type: to.type } : undefined,
    isFromCurrentAccount: currentAccount
      ? from?.address === currentAccount.toLowerCase()
      : false,
    isToCurrentAccount: currentAccount
      ? to?.address === currentAccount.toLowerCase()
      : false,
    // Include the receipt if it exists
    receipts: operationReceipt ? [operationReceipt] : undefined,
    metadata: {
      depth: 0, // Default value that will be overridden if possible
    },
  } as SimplifiedOperation;

  // Calculate depth using getOperationDepth if possible
  if (parsedReceipts && baseOperation.receipts) {
    baseOperation.metadata.depth = getOperationDepth(
      baseOperation,
      parsedReceipts
    );
  }

  // Add contract call metadata if applicable
  if (name === OperationName.contractCall && calls.length > 0) {
    const call = calls[0] as OperationFunctionCall;
    baseOperation.metadata = {
      ...baseOperation.metadata,
      contractId: to?.address,
      functionName: call.functionName,
      functionData: call,
      amount: call.amount ? new BN(call.amount) : undefined,
      assetId: call.assetId,
      // @ts-ignore - receipts will exist in future SDK versions
      receiptType: operation.receipts?.[0]?.type,
    };
  }

  // Add assets if they exist
  if (assetsSent.length > 0) {
    baseOperation.assets = assetsSent.map((asset) => ({
      amount: new BN(asset.amount),
      assetId: asset.assetId,
    }));
  }

  return baseOperation;
}

export function transformOperations(
  summary: TransactionSummary,
  currentAccount?: string,
  parsedReceipts?: ParsedReceiptData[]
): SimplifiedOperation[] {
  if (!summary.operations) return [];

  const allReceipts = summary.receipts || [];
  const operations = summary.operations.map((op) => {
    // @ts-ignore - receipts will exist in future SDK versions
    const operationReceipt = op.receipts?.[0];
    if (!operationReceipt)
      return transformOperation(
        op,
        [],
        currentAccount,
        undefined,
        parsedReceipts
      );

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
      return transformOperation(
        op,
        [],
        currentAccount,
        undefined,
        parsedReceipts
      );
    }

    return transformOperation(
      op,
      allReceipts,
      currentAccount,
      receiptIndex,
      parsedReceipts
    );
  });

  // Calculate bidirectional info for each operation
  return operations;
}

function findIdenticalOperations(operations: SimplifiedOperation[]): {
  identicalGroups: SimplifiedOperation[];
  remainingOps: SimplifiedOperation[];
} {
  const processed = new Set<string>();
  const identicalGroups: SimplifiedOperation[] = [];
  const remainingOps: SimplifiedOperation[] = [];

  for (const [index, op] of operations.entries()) {
    // Skip if already processed
    const opKey = `${op.type}-${op.from.address}-${op.to.address}-${op.metadata?.depth}-${op.metadata?.functionName}`;
    if (processed.has(opKey)) continue;

    // Find identical operations
    const identicals = operations.filter((other, otherIndex) => {
      if (index === otherIndex) return false;
      return (
        op.type === other.type &&
        op.from.address === other.from.address &&
        op.to.address === other.to.address &&
        op.metadata?.depth === other.metadata?.depth &&
        op.metadata?.functionName === other.metadata?.functionName &&
        JSON.stringify(op.assets?.map((a) => a.assetId)) ===
          JSON.stringify(other.assets?.map((a) => a.assetId))
      );
    });

    if (identicals.length > 0) {
      // Create a new operation with combined assets
      const combinedAssets = [...(op.assets || [])].map((asset) => ({
        assetId: asset.assetId,
        amount: identicals.reduce((sum, other) => {
          const otherAsset = other.assets?.find(
            (a) => a.assetId === asset.assetId
          );
          return sum.add(otherAsset?.amount || new BN(0));
        }, asset.amount),
      }));

      const groupedOp: SimplifiedOperation = {
        ...op,
        assets: combinedAssets,
        metadata: {
          ...op.metadata,
          identicalOps: [
            {
              operation: op,
              count: identicals.length + 1,
              instances: [op, ...identicals],
            },
          ],
        },
      };

      identicalGroups.push(groupedOp);
      // Mark all these operations as processed
      processed.add(opKey);
      for (const identical of identicals) {
        const identicalKey = `${identical.type}-${identical.from.address}-${identical.to.address}-${identical.metadata?.depth}-${identical.metadata?.functionName}`;
        processed.add(identicalKey);
      }
    } else {
      remainingOps.push(op);
    }
  }

  return { identicalGroups, remainingOps };
}

function groupSimilarOperations(
  operations: SimplifiedOperation[]
): SimplifiedOperation[] {
  // First find and group identical operations
  const { identicalGroups, remainingOps } = findIdenticalOperations(operations);

  // Then group similar operations (only for remaining ops)
  const baseGroups = remainingOps.reduce(
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
        acc[key].metadata.operationCount! += 1;
        acc[key].metadata.childOperations!.push(op);

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
      }
      return acc;
    },
    {} as Record<string, SimplifiedOperation>
  );

  // Combine both identical groups and similar groups
  return [...identicalGroups, ...Object.values(baseGroups)];
}

function categorizeOperations(
  operations: SimplifiedOperation[],
  _currentAccount?: string
): CategorizedOperations {
  const main: SimplifiedOperation[] = [];
  const otherRoot: SimplifiedOperation[] = [];

  // First pass: separate operations
  for (const op of operations) {
    if (op.isFromCurrentAccount || op.isToCurrentAccount) {
      main.push(op);
    } else {
      otherRoot.push(op);
    }
  }

  // Calculate asset totals for mainOperations
  const assetsTotalFrom: Array<{ assetId: string; amount: BN }> = [];
  const assetsTotalTo: Array<{ assetId: string; amount: BN }> = [];

  // Aggregate assets across all main operations
  for (const op of main) {
    console.log('op', op);
    if (op.isFromCurrentAccount) {
      assetsTotalFrom.push(...(op.assets || []));
    } else {
      assetsTotalTo.push(...(op.assets || []));
    }
  }

  // Group similar operations in each category
  const groupedMain = groupSimilarOperations(main);
  return {
    mainOperations: groupedMain,
    mainOperationsAssetTotals: {
      from: Object.values(assetsTotalFrom),
      to: Object.values(assetsTotalTo),
    },
    otherRootOperations: groupSimilarOperations(otherRoot),
  };
}
function getOperationDepth(
  operation: SimplifiedOperation,
  parsedReceipts: ParsedReceiptData[]
) {
  let depth = 0;
  // find the parsedReceipt where parsedReceipt.data.id === op.receipts[0].id
  const receiptIndex = parsedReceipts.findIndex(
    (r) => r.data.id === operation.receipts[0].id
  );
  if (receiptIndex !== -1) {
    depth = parsedReceipts[receiptIndex].indent;
  }
  return depth;
}

export function simplifyTransaction(
  summary: TransactionSummary | TransactionResult,
  request?: TransactionRequest,
  currentAccount?: string
): SimplifiedTransaction {
  console.log('summary', summary);
  const parsedReceipts = parseReceipts(summary.receipts);
  const operations = transformOperations(
    summary,
    currentAccount,
    parsedReceipts
  );

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
  return simplifiedTransaction;
}
