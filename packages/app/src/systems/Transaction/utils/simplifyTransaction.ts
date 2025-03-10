import type {
  Operation,
  Receipt,
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
import type { SimplifiedOperation } from '../types';
import { TxCategory } from '../types';
import type { CategorizedOperations, SimplifiedTransaction } from '../types';
import type { AssetFlow } from '../types';

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

function parseReceipts(receipts: Receipt[]) {
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
  currentAccount?: string,
  parsedReceipts?: ParsedReceiptData[]
): SimplifiedOperation {
  const { name, from, to, assetsSent = [], calls = [] } = operation;

  const operationReceipt = operation.receipts?.[0];
  const operationType = getOperationType(operation);

  const baseOperation = {
    type: operationType,
    from: from ? { address: from.address, type: from.type } : undefined,
    to: to ? { address: to.address, type: to.type } : undefined,
    isFromCurrentAccount: currentAccount
      ? from?.address.toLowerCase() === currentAccount.toLowerCase()
      : false,
    isToCurrentAccount: currentAccount
      ? to?.address.toLowerCase() === currentAccount.toLowerCase()
      : false,

    receipts: operationReceipt ? [operationReceipt] : undefined,
    metadata: {
      depth: 0,
    },
  } as SimplifiedOperation;

  if (parsedReceipts && baseOperation.receipts) {
    baseOperation.metadata.depth = getOperationDepth(
      baseOperation,
      parsedReceipts
    );
  }

  if (name === OperationName.contractCall && calls.length > 0) {
    const call = calls[0] as OperationFunctionCall;
    baseOperation.metadata = {
      ...baseOperation.metadata,
      contractId: to?.address,
      functionName: call.functionName,
      functionData: call,
      amount: call.amount ? new BN(call.amount) : undefined,
      assetId: call.assetId,

      receiptType: operation.receipts?.[0]?.type,
    };
  }

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
    const operationReceipt = op.receipts?.[0];
    if (!operationReceipt)
      return transformOperation(op, currentAccount, parsedReceipts);

    const receiptIndex = allReceipts.findIndex((r) => {
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
      return transformOperation(op, currentAccount, parsedReceipts);
    }

    return transformOperation(op, currentAccount, parsedReceipts);
  });

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
    const opKey = `${op.type}-${op.from.address}-${op.to.address}-${op.metadata?.depth}-${op.metadata?.functionName}`;
    if (processed.has(opKey)) continue;

    const identicals = operations.filter((other, otherIndex) => {
      if (index === otherIndex) return false;
      return (
        op.type === other.type &&
        op.from.address === other.from.address &&
        op.to.address === other.to.address &&
        op.metadata?.depth === other.metadata?.depth &&
        // op.metadata?.functionName === other.metadata?.functionName &&
        JSON.stringify(op.assets?.map((a) => a.assetId)) ===
          JSON.stringify(other.assets?.map((a) => a.assetId))
      );
    });

    if (identicals.length > 0) {
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
  const { identicalGroups, remainingOps } = findIdenticalOperations(operations);

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
            if (existing[0]) {
              existing[0].amount = existing[0].amount.add(asset.amount);
            } else {
              existing[0] = { amount: asset.amount, assetId: asset.assetId };
            }
          } else {
            acc[key].metadata.groupedAssets![asset.assetId] = [
              { amount: asset.amount, assetId: asset.assetId },
            ];
          }
        }
      }
      return acc;
    },
    {} as Record<string, SimplifiedOperation>
  );

  return [...identicalGroups, ...Object.values(baseGroups)];
}

function categorizeOperations(
  operations: SimplifiedOperation[]
): CategorizedOperations {
  const main: SimplifiedOperation[] = [];
  const otherRoot: SimplifiedOperation[] = [];
  const otherOperations: SimplifiedOperation[] = [];

  for (const op of operations) {
    console.log('opd', op.metadata.depth);
    if (op.isFromCurrentAccount || op.isToCurrentAccount) {
      main.push(op);
    } else if (op.metadata.depth === 0) {
      otherRoot.push(op);
    } else {
      otherOperations.push(op);
    }
  }

  const assetsTotalFrom: Array<{ assetId: string; amount: BN }> = [];
  const assetsTotalTo: Array<{ assetId: string; amount: BN }> = [];

  for (const op of main) {
    if (op.isFromCurrentAccount) {
      assetsTotalFrom.push(...(op.assets || []));
    } else {
      assetsTotalTo.push(...(op.assets || []));
    }
  }

  const groupedMain = groupSimilarOperations(main);
  return {
    mainOperations: groupedMain,
    otherRootOperations: groupSimilarOperations(otherRoot),
    otherOperations: groupSimilarOperations(otherOperations),
  };
}
function getOperationDepth(
  operation: SimplifiedOperation,
  parsedReceipts: ParsedReceiptData[]
) {
  let depth = 0;

  const receiptIndex = parsedReceipts.findIndex(
    (r) => r.data.id === operation.receipts[0].id
  );
  if (receiptIndex !== -1) {
    depth = parsedReceipts[receiptIndex].indent;
  }
  console.log('depth', depth);
  return depth;
}

export function simplifyTransaction(
  summary: TransactionSummary | TransactionResult,
  request?: TransactionRequest,
  currentAccount?: string
): SimplifiedTransaction {
  const parsedReceipts = parseReceipts(summary.receipts);
  const operations = transformOperations(
    summary,
    currentAccount,
    parsedReceipts
  );

  const categorizedV2 = categorizeOperationsV2(operations);

  const categorizedOperations = categorizeOperations(operations);

  const simplifiedTransaction = {
    id: summary.id,
    operations,
    categorizedOperations,
    categorizedV2Operations: categorizedV2,
    fee: {
      total: new BN(summary.fee || 0),
      network: new BN(summary.fee || 0).sub(new BN(request?.tip || 0)),
      tip: new BN(request?.tip || 0),
      gasUsed: new BN(summary.gasUsed || 0),
      gasPrice: new BN(0),
    },
  };
  return simplifiedTransaction;
}

export function sumAssets(operations: SimplifiedOperation[]): AssetFlow[] {
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

export function groupOpsFromCurrentAccountToContract(
  operations: SimplifiedOperation[]
): Record<string, SimplifiedOperation[]> {
  // contract call only depth 0
  // transfer any depth
  const groupedFromAccountToContract = operations
    .filter((op) => {
      const isRootContractCall =
        op.type === TxCategory.CONTRACTCALL && op.metadata.depth === 0;
      const isTransfer = op.type === TxCategory.SEND && op.to.type === 0;

      return op.isFromCurrentAccount && (isRootContractCall || isTransfer);
    })
    .reduce(
      (acc, op) => {
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [op.from.address]: [...(acc[op.from.address] || []), op],
        };
      },
      {} as Record<string, SimplifiedOperation[]>
    );

  return groupedFromAccountToContract;
}

export function groupOpsFromContractToCurrentAccount(
  operations: SimplifiedOperation[]
): Record<string, SimplifiedOperation[]> {
  const groupedFromContractToAccount = operations
    .filter(
      (op) =>
        op.isToCurrentAccount &&
        op.type === TxCategory.SEND &&
        op.from.type === 0
    )
    .reduce(
      (acc, op) => {
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [op.from.address]: [...(acc[op.from.address] || []), op],
        };
      },
      {} as Record<string, SimplifiedOperation[]>
    );

  return groupedFromContractToAccount;
}

// @TODO: should remove the other function
export function onlySumAssets(
  operations?: SimplifiedOperation[]
): Record<string, BN> {
  const assets: Record<string, BN> = {};

  for (const op of operations || []) {
    if (!op.assets?.length) continue;

    for (const asset of op.assets) {
      const { assetId, amount } = asset;
      assets[assetId] = (assets[assetId] || new BN(0)).add(amount);
    }
  }

  return assets;
}

export function categorizeOperationsV2(inputOperations: SimplifiedOperation[]) {
  const intermediateContractCalls = [];
  const notRelatedToCurrentAccount = [];
  const remainingOps = [];

  for (const op of inputOperations) {
    if (op.type === TxCategory.CONTRACTCALL && (op.metadata.depth || 0) > 0) {
      intermediateContractCalls.push(op);
    } else if (!op.isFromCurrentAccount && !op.isToCurrentAccount) {
      notRelatedToCurrentAccount.push(op);
    } else {
      remainingOps.push(op);
    }
  }

  const mainOperations = getMainOperations(remainingOps);

  return {
    mainOperations,
    intermediateContractCalls,
    notRelatedToCurrentAccount,
  };
}

export function getMainOperations(
  operations: SimplifiedOperation[]
): SimplifiedOperation[] {
  const groupedFromAccountToContract =
    groupOpsFromCurrentAccountToContract(operations);
  const groupedFromContractToAccount =
    groupOpsFromContractToCurrentAccount(operations);

  const mainOperations: SimplifiedOperation[] = [];

  for (const [fromAccount, opsFromAccount] of Object.entries(
    groupedFromAccountToContract
  )) {
    const contractAddress = opsFromAccount[0].to.address;
    const opsToCurrentAccount = groupedFromContractToAccount[contractAddress];

    const assetsFromTo = Object.entries(onlySumAssets(opsFromAccount)).map(
      ([assetId, amount]) => ({ assetId, amount })
    );
    const assetsToFrom = Object.entries(onlySumAssets(opsToCurrentAccount)).map(
      ([assetId, amount]) => ({ assetId, amount })
    );

    const hasAssetsComingBack = assetsToFrom.some((a) => a.amount.gt(0));

    const isContractCallSendingFunds = opsFromAccount.some((op) => {
      const hasAssets = Object.values(onlySumAssets([op])).some((a) => a.gt(0));
      return op.type === TxCategory.CONTRACTCALL && hasAssets;
    });
    const isTransfer = opsFromAccount.some((op) => op.type === TxCategory.SEND);
    const isTypeContractCall = isContractCallSendingFunds || !isTransfer;
    const baseOperation = {
      type: isTypeContractCall ? TxCategory.CONTRACTCALL : TxCategory.SEND,
      from: {
        address: fromAccount,
        type: 1,
      },
      to: {
        address: contractAddress,
        type: 0,
      },
      isFromCurrentAccount: true,
      isToCurrentAccount: false,
      assets: assetsFromTo,
      metadata: {
        depth: 0,
      },
    };

    if (hasAssetsComingBack) {
      const mainOperation: SimplifiedOperation = {
        ...baseOperation,
        assetsToFrom,
        operations: [...opsFromAccount, ...opsToCurrentAccount],
      };
      mainOperations.push(mainOperation);
    } else {
      const mainOperation: SimplifiedOperation = {
        ...baseOperation,
        operations: [...opsFromAccount],
      };
      mainOperations.push(mainOperation);
    }
  }

  const transferOperationsNotGrouped = operations.filter((op) => {
    if (op.type !== TxCategory.SEND) return false;

    const isAlreadyGrouped = mainOperations.find((mainOp) => {
      const isFromSameAccount = mainOp.from.address === op.from.address;
      const isToSameAccount = mainOp.to.address === op.to.address;

      const isSendingBack =
        mainOp.to.address === op.from.address &&
        mainOp.from.address === op.to.address;

      return (isFromSameAccount && isToSameAccount) || isSendingBack;
    });
    return !isAlreadyGrouped;
  });
  if (transferOperationsNotGrouped.length > 0) {
    // @TODO: group transfers
    if (transferOperationsNotGrouped.length === 1) {
      mainOperations.push(...transferOperationsNotGrouped);
    } else {
      const groupedEqualTransfers = transferOperationsNotGrouped.reduce(
        (acc, op) => {
          return {
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...acc,
            [`${op.from.address}-${op.to.address}`]: [
              ...(acc[op.from.address + op.to.address] || []),
              op,
            ],
          };
        },
        {} as Record<string, SimplifiedOperation[]>
      );

      for (const [, ops] of Object.entries(groupedEqualTransfers)) {
        const assetsFromTo = Object.entries(onlySumAssets(ops)).map(
          ([assetId, amount]) => ({ assetId, amount })
        );

        const groupedTransferOperation = {
          ...ops[0],
          assets: assetsFromTo,
          operations: [...ops],
          metadata: {
            depth: 0,
          },
        };

        mainOperations.push(groupedTransferOperation);
      }
    }
  }

  return mainOperations;
}
