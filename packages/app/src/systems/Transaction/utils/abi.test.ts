import {
  Address,
  type JsonAbi,
  ReceiptType,
  ScriptTransactionRequest,
  TransactionType,
  ZeroBytes32,
  arrayify,
  bn,
  concat,
  getOperations,
  hexlify,
  toBytes,
} from 'fuels';
import { withAbiFallback } from './abi';

const CONTRACT_ID = `0x${'cd'.repeat(32)}`;
const BASE_ASSET = `0x${'00'.repeat(32)}`;
const ACCOUNT = `0x${'11'.repeat(32)}`;
const UNIT_TYPE =
  '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d';

const createAbi = (functions: JsonAbi['functions']) =>
  ({
    programType: 'contract',
    specVersion: '1',
    encodingVersion: '1',
    concreteTypes: [{ type: '()', concreteTypeId: UNIT_TYPE }],
    metadataTypes: [],
    functions,
    loggedTypes: [],
    messagesTypes: [],
    configurables: [],
  }) as JsonAbi;

const pingAbi = createAbi([
  { name: 'ping', inputs: [], output: UNIT_TYPE, attributes: null },
]);
const wrongAbi = createAbi([]);

// A script calling `ping` on CONTRACT_ID, with the matching Call receipt
function getPingOperations(abiMap?: Record<string, JsonAbi>) {
  const selector = new TextEncoder().encode('ping');
  const param1 = bn(1000);
  const param2 = bn(2000);
  const request = new ScriptTransactionRequest({
    scriptData: concat([
      arrayify(CONTRACT_ID),
      toBytes(param1.toHex(), 8),
      toBytes(param2.toHex(), 8),
      toBytes(bn(selector.length).toHex(), 8),
      selector,
    ]),
  });
  request.addCoinInput({
    id: `0x${'22'.repeat(32)}0000`,
    assetId: BASE_ASSET,
    amount: bn(100),
    owner: new Address(ACCOUNT),
    blockCreated: bn(0),
    txCreatedIdx: bn(0),
  });
  request.addContractInputAndOutput(new Address(CONTRACT_ID));
  const transaction = request.toTransaction();

  return getOperations({
    transactionType: TransactionType.Script,
    inputs: transaction.inputs,
    outputs: transaction.outputs,
    receipts: [
      {
        type: ReceiptType.Call,
        id: ZeroBytes32,
        to: CONTRACT_ID,
        amount: bn(0),
        assetId: BASE_ASSET,
        gas: bn(1),
        param1,
        param2,
        pc: bn(0),
        is: bn(0),
      },
    ],
    rawPayload: hexlify(request.toTransactionBytes()),
    baseAssetId: BASE_ASSET,
    maxInputs: bn(255),
    abiMap,
    // biome-ignore lint/suspicious/noExplicitAny: partial SDK input
  } as any);
}

describe('withAbiFallback', () => {
  it('decodes calls with the saved ABI', async () => {
    const operations = await withAbiFallback(
      { [CONTRACT_ID]: pingAbi },
      async (abiMap) => getPingOperations(abiMap)
    );
    expect(operations[0].calls?.[0]?.functionName).toBe('ping');
  });

  it('shows the transaction without decoded calls when the saved ABI does not match', async () => {
    expect(() => getPingOperations({ [CONTRACT_ID]: wrongAbi })).toThrow();

    const operations = await withAbiFallback(
      { [CONTRACT_ID]: wrongAbi },
      async (abiMap) => getPingOperations(abiMap)
    );
    expect(operations).toHaveLength(1);
    expect(operations[0].calls ?? []).toHaveLength(0);
  });

  it('keeps errors that have nothing to do with ABIs', async () => {
    const getSummary = jest.fn(async () => {
      throw new Error('node is down');
    });
    await expect(withAbiFallback({}, getSummary)).rejects.toThrow(
      'node is down'
    );
    expect(getSummary).toHaveBeenCalledTimes(1);
  });
});
