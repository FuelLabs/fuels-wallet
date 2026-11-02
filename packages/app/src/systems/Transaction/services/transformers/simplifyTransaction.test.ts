import {
  InputType,
  OutputType,
  ReceiptType,
  TransactionType,
  bn,
  getOperations,
} from 'fuels';
import { type SimplifiedOperation, TxCategory } from '../../types';
import { getMainOperations, simplifyTransaction } from './simplifyTransaction';

const hex = (c: string) => `0x${c.repeat(64)}`;
const ACCOUNT = hex('1');
const RECIPIENT = hex('2');
const BASE_ASSET = hex('3');
const OTHER_ASSET = hex('4');
const ZERO = hex('0');

const sentAmounts = (ops: SimplifiedOperation[]) =>
  ops.flatMap((op) => (op.assets || []).map((a) => a.amount.toString()));

describe('getMainOperations', () => {
  it('keeps every transfer when the same pair sends twice', () => {
    const send = (assetId: string, amount: number) =>
      ({
        type: TxCategory.SEND,
        from: { address: ACCOUNT, type: 1 },
        to: { address: RECIPIENT, type: 1 },
        isFromCurrentAccount: true,
        isToCurrentAccount: false,
        assets: [{ assetId, amount: bn(amount) }],
        metadata: { depth: 0 },
      }) as SimplifiedOperation;

    const mainOperations = getMainOperations([
      send(OTHER_ASSET, 5000),
      send(BASE_ASSET, 1),
    ]);

    expect(mainOperations).toHaveLength(1);
    expect(sentAmounts(mainOperations).sort()).toEqual(['1', '5000']);
  });
});

describe('simplifyTransaction', () => {
  it('shows a transfer and a withdrawal to the same address as separate operations', () => {
    const scriptResult = {
      type: ReceiptType.ScriptResult,
      result: bn(0),
      gasUsed: bn(1),
    };
    const messageOut = {
      type: ReceiptType.MessageOut,
      sender: ZERO,
      recipient: RECIPIENT,
      amount: bn(1),
      nonce: ZERO,
      len: 0,
      digest: ZERO,
      data: new Uint8Array(),
    };
    const receipts = [messageOut, scriptResult];
    const operations = getOperations({
      transactionType: TransactionType.Script,
      inputs: [
        {
          type: InputType.Coin,
          owner: ACCOUNT,
          assetId: BASE_ASSET,
          amount: bn(100000),
        },
      ],
      outputs: [
        {
          type: OutputType.Coin,
          to: RECIPIENT,
          amount: bn(7777),
          assetId: BASE_ASSET,
        },
        { type: OutputType.Change, to: ACCOUNT, assetId: BASE_ASSET },
      ],
      receipts,
      baseAssetId: BASE_ASSET,
      // biome-ignore lint/suspicious/noExplicitAny: partial SDK input
    } as any);
    expect(operations).toHaveLength(2);

    const simplified = simplifyTransaction(
      // biome-ignore lint/suspicious/noExplicitAny: partial summary
      { id: '0x1', operations, receipts, fee: bn(1), gasUsed: bn(1) } as any,
      undefined,
      ACCOUNT
    );
    const { mainOperations } = simplified!.categorizedOperations;

    expect(mainOperations).toHaveLength(2);
    expect(sentAmounts(mainOperations).sort()).toEqual(['1', '7777']);
    const withdrawal = mainOperations.find((op) =>
      op.receipts?.some((r) => r.type === ReceiptType.MessageOut)
    );
    expect(sentAmounts([withdrawal!])).toEqual(['1']);
  });
});
