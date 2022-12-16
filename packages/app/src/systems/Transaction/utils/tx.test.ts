import { AddressType } from '@fuel-wallet/types';
import { bn, TransactionType } from 'fuels';

import {
  MOCK_TRANSACTION_CONTRACT_CALL,
  MOCK_INPUT_COIN,
  MOCK_INPUT_CONTRACT,
  MOCK_OUTPUT_CHANGE,
  MOCK_OUTPUT_CONTRACT,
  MOCK_RECEIPTS_CONTRACT_CALL,
  MOCK_RECEIPT_CALL,
  MOCK_GAS_PER_BYTE,
  MOCK_GAS_PRICE_FACTOR,
  MOCK_PARSED_TX_CONTRACT_CALL,
} from '../__mocks__/tx';

import {
  addOperation,
  getFee,
  getFlags,
  getFromAddress,
  getGasUsed,
  getInputContractFromIndex,
  getInputsCoin,
  getInputsContract,
  getInputsMessage,
  getOperations,
  getOutputsChange,
  getOutputsCoin,
  getOutputsContract,
  getOutputsContractCreated,
  getOutputsMessage,
  getReceiptsCall,
  getReceiptsLog,
  getReceiptsLogData,
  getReceiptsMessageOut,
  getReceiptsPanic,
  getReceiptsReturn,
  getReceiptsReturnData,
  getReceiptsRevert,
  getReceiptsScriptResult,
  getReceiptsTransfer,
  getReceiptsTransferOut,
  getStatus,
  getTotalAssetsSent,
  getType,
  Operations,
  parseTx,
  Status,
  Type,
} from './tx';

describe('Tx util', () => {
  describe('getTxStatus', () => {
    it('should return correct status', () => {
      expect(getStatus('FailureStatus')).toEqual(Status.failure);
      expect(getStatus('SuccessStatus')).toEqual(Status.success);
      expect(getStatus('SubmittedStatus')).toEqual(Status.pending);
      expect(getStatus()).toBeUndefined();
    });
  });

  describe('getInputs', () => {
    it('should getInputsCoin return correct inputs', () => {
      const inputs = getInputsCoin(MOCK_TRANSACTION_CONTRACT_CALL);
      expect(JSON.stringify(inputs)).toEqual(JSON.stringify([MOCK_INPUT_COIN]));
      expect(getInputsCoin()).toEqual([]);
    });

    it('should getInputsContract return correct inputs', () => {
      const inputs = getInputsContract(MOCK_TRANSACTION_CONTRACT_CALL);
      expect(JSON.stringify(inputs)).toEqual(
        JSON.stringify([MOCK_INPUT_CONTRACT])
      );
      expect(getInputsContract()).toEqual([]);
    });

    it('should getInputsMessage return correct inputs', () => {
      const inputs = getInputsMessage(MOCK_TRANSACTION_CONTRACT_CALL);
      // TODO: add a real test here... for now we don't even support message inputs in screens
      expect(JSON.stringify(inputs)).toEqual(JSON.stringify([]));
      expect(getInputsMessage()).toEqual([]);
    });

    it('should getInputContractFromIndex return correct inputs', () => {
      const contractOutput = getOutputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL
      )?.[0];
      const input = getInputContractFromIndex(
        MOCK_TRANSACTION_CONTRACT_CALL,
        contractOutput.inputIndex
      );
      // TODO: add a real test here... for now we don't even support message inputs in screens
      expect(JSON.stringify(input)).toEqual(
        JSON.stringify(MOCK_INPUT_CONTRACT)
      );
      expect(getInputContractFromIndex()).toBeUndefined();
      expect(
        getInputContractFromIndex(MOCK_TRANSACTION_CONTRACT_CALL)
      ).toBeUndefined();
    });
  });

  describe('getFromAddress', () => {
    it('should return correct fromAddress', () => {
      const fromAddress = MOCK_INPUT_COIN.owner;
      expect(getFromAddress(MOCK_TRANSACTION_CONTRACT_CALL)).toEqual(
        fromAddress
      );
      expect(getFromAddress()).toBeUndefined();
    });
  });

  describe('getOutputs', () => {
    it('should getOutputsCoin return correct outputs', () => {
      const outputs = getOutputsCoin(MOCK_TRANSACTION_CONTRACT_CALL);
      // TODO: add a real test here...
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getInputsCoin()).toEqual([]);
    });

    it('should getOutputsContract return correct outputs', () => {
      const outputs = getOutputsContract(MOCK_TRANSACTION_CONTRACT_CALL);
      // TODO: add a real test here...
      expect(JSON.stringify(outputs)).toEqual(
        JSON.stringify([MOCK_OUTPUT_CONTRACT])
      );
      expect(getInputsCoin()).toEqual([]);
    });

    it('should getOutputsMessage return correct outputs', () => {
      const outputs = getOutputsMessage(MOCK_TRANSACTION_CONTRACT_CALL);
      // TODO: add a real test here... for now we don't even support message outputs in screens
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getOutputsMessage()).toEqual([]);
    });

    it('should getOutputsVariable return correct outputs', () => {
      // const outputs = getOutputsVariable(MOCK_TRANSACTION_CONTRACT_CALL);
      // TODO: add a real test here... for now we don't even support message outputs in screens
      // expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      // expect(getOutputsVariable()).toEqual([]);
    });

    it('should getOutputsChange return correct outputs', () => {
      const outputs = getOutputsChange(MOCK_TRANSACTION_CONTRACT_CALL);
      expect(JSON.stringify(outputs)).toEqual(
        JSON.stringify([MOCK_OUTPUT_CHANGE])
      );
      expect(getOutputsChange()).toEqual([]);
    });

    it('should getOutputsContractCreated return correct outputs', () => {
      const outputs = getOutputsContractCreated(MOCK_TRANSACTION_CONTRACT_CALL);
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getOutputsContractCreated()).toEqual([]);
    });
  });

  describe('getReceipts', () => {
    it('should getReceiptsCall return correct receipts', () => {
      const outputs = getReceiptsCall();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsCall()).toEqual([]);
    });

    it('should getReceiptsReturn return correct receipts', () => {
      const outputs = getReceiptsReturn();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsReturn()).toEqual([]);
    });

    it('should getReceiptsReturnData return correct receipts', () => {
      const outputs = getReceiptsReturnData();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsReturnData()).toEqual([]);
    });

    it('should getReceiptsPanic return correct receipts', () => {
      const outputs = getReceiptsPanic();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsPanic()).toEqual([]);
    });

    it('should getReceiptsRevert return correct receipts', () => {
      const outputs = getReceiptsRevert();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsRevert()).toEqual([]);
    });

    it('should getReceiptsLog return correct receipts', () => {
      const outputs = getReceiptsLog();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsLog()).toEqual([]);
    });

    it('should getReceiptsLogData return correct receipts', () => {
      const outputs = getReceiptsLogData();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsLogData()).toEqual([]);
    });

    it('should getReceiptsTransfer return correct receipts', () => {
      const outputs = getReceiptsTransfer();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsTransfer()).toEqual([]);
    });

    it('should getReceiptsTransferOut return correct receipts', () => {
      const outputs = getReceiptsTransferOut();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsTransferOut()).toEqual([]);
    });

    it('should getReceiptsScriptResult return correct receipts', () => {
      const outputs = getReceiptsScriptResult();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsScriptResult()).toEqual([]);
    });

    it('should getReceiptsMessageOut return correct receipts', () => {
      const outputs = getReceiptsMessageOut();
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      expect(getReceiptsMessageOut()).toEqual([]);
    });
  });

  describe('getType', () => {
    it('should getType return correct type', () => {
      expect(getType(TransactionType.Create)).toEqual(Type.create);
      expect(getType(TransactionType.Script)).toEqual(Type.script);
      expect(getType(TransactionType.Mint)).toEqual(Type.mint);
      expect(getType()).toBeUndefined();
    });
  });

  describe('getFlags', () => {
    it('should getFlags return all false with no inputs', () => {
      const flags = getFlags();
      expect(flags.isStatusFailure).toEqual(false);
      expect(flags.isStatusPending).toEqual(false);
      expect(flags.isStatusSuccess).toEqual(false);
      expect(flags.isTypeCreate).toEqual(false);
      expect(flags.isTypeMint).toEqual(false);
      expect(flags.isTypeScript).toEqual(false);
    });

    it('should getFlags return correct flags regarding status', () => {
      const successFlags = getFlags(
        MOCK_TRANSACTION_CONTRACT_CALL,
        Status.success
      );
      expect(successFlags.isStatusFailure).toEqual(false);
      expect(successFlags.isStatusPending).toEqual(false);
      expect(successFlags.isStatusSuccess).toEqual(true);
    });

    it('should getFlags return correct flags regarding transaction type', () => {
      const scriptFlags = getFlags({ type: TransactionType.Script });
      expect(scriptFlags.isTypeCreate).toEqual(false);
      expect(scriptFlags.isTypeMint).toEqual(false);
      expect(scriptFlags.isTypeScript).toEqual(true);

      const createFlags = getFlags({ type: TransactionType.Create });
      expect(createFlags.isTypeCreate).toEqual(true);
      expect(createFlags.isTypeMint).toEqual(false);
      expect(createFlags.isTypeScript).toEqual(false);

      const mintFlags = getFlags({ type: TransactionType.Mint });
      expect(mintFlags.isTypeCreate).toEqual(false);
      expect(mintFlags.isTypeMint).toEqual(true);
      expect(mintFlags.isTypeScript).toEqual(false);
    });
  });

  describe('addOperation', () => {
    const fromAddress = getFromAddress(MOCK_TRANSACTION_CONTRACT_CALL);
    const OPERATION_CONTRACT_CALL = {
      name: Operations.contractCall,
      from: {
        type: AddressType.account,
        address: fromAddress,
      },
      to: {
        type: AddressType.contract,
        address: '0x0000000000000000000000000000000000000001',
      },
      assetsSent: [
        {
          assetId: '0x0000000000000000000000000000000000000000',
          amount: bn(100000),
        },
      ],
    };

    it('should just add operation when its the first one', () => {
      const operations = addOperation([], OPERATION_CONTRACT_CALL);
      expect(JSON.stringify(operations)).toEqual(
        JSON.stringify([OPERATION_CONTRACT_CALL])
      );
    });

    it('should not stack operations with different name / from / to', () => {
      const baseOperations = addOperation([], OPERATION_CONTRACT_CALL);
      const operationsDifName = addOperation(baseOperations, {
        ...OPERATION_CONTRACT_CALL,
        name: Operations.contractCreated,
      });
      const operationsEmptyName = addOperation(baseOperations, {
        ...OPERATION_CONTRACT_CALL,
        name: undefined,
      });
      const operationsDifFrom = addOperation(baseOperations, {
        ...OPERATION_CONTRACT_CALL,
        from: {
          ...OPERATION_CONTRACT_CALL.from,
          address: '0x0000000000000000000000000000000000000002',
        },
      });
      const operationsEmptyFrom = addOperation(baseOperations, {
        ...OPERATION_CONTRACT_CALL,
        from: undefined,
      });
      const operationsDifTo = addOperation(baseOperations, {
        ...OPERATION_CONTRACT_CALL,
        to: {
          ...OPERATION_CONTRACT_CALL.to,
          address: '0x0000000000000000000000000000000000000002',
        },
      });
      const operationsEmptyTo = addOperation(baseOperations, {
        ...OPERATION_CONTRACT_CALL,
        to: undefined,
      });

      expect(operationsDifName.length).toEqual(2);
      expect(operationsEmptyName.length).toEqual(2);
      expect(operationsDifFrom.length).toEqual(2);
      expect(operationsEmptyFrom.length).toEqual(2);
      expect(operationsDifTo.length).toEqual(2);
      expect(operationsEmptyTo.length).toEqual(2);
    });

    describe('should stack operations with same name / from / to', () => {
      it('should return prev operation if no asset is sent to add', () => {
        const baseOperations = addOperation([], OPERATION_CONTRACT_CALL);
        const operationsAddedSameAsset = addOperation(baseOperations, {
          ...OPERATION_CONTRACT_CALL,
          assetsSent: undefined,
        });

        expect(JSON.stringify(operationsAddedSameAsset)).toEqual(
          JSON.stringify(baseOperations)
        );
      });
      it('should stack when same asset is added', () => {
        const baseOperations = addOperation([], OPERATION_CONTRACT_CALL);
        const operationsAddedSameAsset = addOperation(
          baseOperations,
          OPERATION_CONTRACT_CALL
        );
        expect(operationsAddedSameAsset.length).toEqual(1);
        expect(
          operationsAddedSameAsset[0].assetsSent?.[0]?.amount.valueOf()
        ).toEqual(
          OPERATION_CONTRACT_CALL.assetsSent[0].amount.mul(2).valueOf()
        );
        expect(operationsAddedSameAsset[0].assetsSent?.[0]?.assetId).toEqual(
          OPERATION_CONTRACT_CALL.assetsSent[0].assetId
        );
      });
      it('should stack when same asset is added together with a different asset', () => {
        const DIF_ASSET_ID = '0x0012300000000000000000000000000000000001';
        const operationTwoAssets = {
          ...OPERATION_CONTRACT_CALL,
          assetsSent: [
            {
              ...OPERATION_CONTRACT_CALL.assetsSent[0],
            },
            {
              ...OPERATION_CONTRACT_CALL.assetsSent[0],
              assetId: DIF_ASSET_ID,
            },
          ],
        };

        const baseOperations = addOperation([], OPERATION_CONTRACT_CALL);
        const operationsAddedSameAsset = addOperation(
          baseOperations,
          operationTwoAssets
        );
        expect(operationsAddedSameAsset.length).toEqual(1);
        expect(
          operationsAddedSameAsset[0].assetsSent?.[0]?.amount.valueOf()
        ).toEqual(
          OPERATION_CONTRACT_CALL.assetsSent[0].amount.mul(2).valueOf()
        );
        expect(operationsAddedSameAsset[0].assetsSent?.[0]?.assetId).toEqual(
          OPERATION_CONTRACT_CALL.assetsSent[0].assetId
        );
        expect(
          operationsAddedSameAsset[0].assetsSent?.[1]?.amount.valueOf()
        ).toEqual(OPERATION_CONTRACT_CALL.assetsSent[0].amount.valueOf());
        expect(operationsAddedSameAsset[0].assetsSent?.[1]?.assetId).toEqual(
          DIF_ASSET_ID
        );
      });
    });
  });

  describe('getOperation', () => {
    // getContractCreatedOperations
    // getTransferOperations
    // getPayProducerOperations
    it('should getOperations return contract call operations', () => {
      const fromAddress = getFromAddress(MOCK_TRANSACTION_CONTRACT_CALL);
      const contractOutputs = getOutputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL
      );
      const contractInput = getInputContractFromIndex(
        MOCK_TRANSACTION_CONTRACT_CALL,
        contractOutputs[0].inputIndex
      );

      const operations = getOperations(
        MOCK_TRANSACTION_CONTRACT_CALL,
        MOCK_RECEIPTS_CONTRACT_CALL
      );
      expect(operations.length).toEqual(1);
      expect(operations[0].name).toEqual(Operations.contractCall);
      expect(operations[0]?.from?.type).toEqual(AddressType.account);
      expect(operations[0]?.from?.address).toEqual(fromAddress);
      expect(operations[0]?.to?.type).toEqual(AddressType.contract);
      expect(operations[0]?.to?.address).toEqual(contractInput?.contractID);
      expect(operations[0].assetsSent?.[0]?.assetId).toEqual(
        MOCK_RECEIPT_CALL.assetId
      );
      expect(operations[0].assetsSent?.[0]?.amount.valueOf()).toEqual(
        MOCK_RECEIPT_CALL.amount.valueOf()
      );
    });

    it('should getOperations return transfer operations', () => {});

    it('should getOperations return mint operations', () => {});

    it('should getOperations return contract created operations', () => {});
  });

  describe('getTotalAssetsSent', () => {
    // TODO: add other combinations of only 1 asset, 2 asset equals, different assets. check sums etcv
    it('should getTotalAssetsSent return total assets from contract call', () => {
      const totalAssetsSent = getTotalAssetsSent(
        MOCK_TRANSACTION_CONTRACT_CALL,
        MOCK_RECEIPTS_CONTRACT_CALL
      );
      expect(totalAssetsSent[0]?.assetId).toEqual(MOCK_RECEIPT_CALL.assetId);
      expect(totalAssetsSent[0]?.amount.valueOf()).toEqual(
        MOCK_RECEIPT_CALL.amount.valueOf()
      );
    });
  });

  describe('getGasUsed', () => {
    it('should getGasUsed return gasUsed from tx', () => {
      const gasUsed = getGasUsed(
        MOCK_TRANSACTION_CONTRACT_CALL,
        MOCK_RECEIPTS_CONTRACT_CALL,
        MOCK_GAS_PER_BYTE,
        MOCK_GAS_PRICE_FACTOR
      );
      expect(gasUsed.valueOf()).toEqual(bn(167824).valueOf());
    });
  });

  describe('getFee', () => {
    // add other fee situations
    // fee from bytes of contract created transaction
    // fee from transfer operations
    it('should getFee return fee from tx', () => {
      const fee = getFee(
        MOCK_TRANSACTION_CONTRACT_CALL,
        MOCK_RECEIPTS_CONTRACT_CALL,
        MOCK_GAS_PER_BYTE,
        MOCK_GAS_PRICE_FACTOR
      );
      expect(fee.valueOf()).toEqual(bn(1).valueOf());
    });
  });

  describe('parseTx', () => {
    it('should parseTx return correct data for contract call transaction', () => {
      const tx = parseTx({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL,
        receipts: MOCK_RECEIPTS_CONTRACT_CALL,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFacor: MOCK_GAS_PRICE_FACTOR,
        gqlStatus: 'SuccessStatus',
        id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6ade7',
      });

      expect(JSON.stringify(tx)).toEqual(
        JSON.stringify(MOCK_PARSED_TX_CONTRACT_CALL)
      );
    });
  });
});
