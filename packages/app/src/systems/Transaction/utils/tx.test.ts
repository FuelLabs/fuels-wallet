import { AddressType } from '@fuel-wallet/types';
import { bn, ReceiptType, TransactionType } from 'fuels';

import {
  MOCK_TRANSACTION_CONTRACT_CALL_PARTS,
  MOCK_GAS_PER_BYTE,
  MOCK_GAS_PRICE_FACTOR,
  MOCK_TRANSACTION_CONTRACT_CALL,
  MOCK_TRANSACTION_CREATE_CONTRACT,
  MOCK_TRANSACTION_CREATE_CONTRACT_PARTS,
  MOCK_TRANSACTION_MINT,
  MOCK_TRANSACTION_MINT_PARTS,
  MOCK_TRANSACTION_TRANSFER,
  MOCK_TRANSACTION_TRANSFER_PARTS,
} from '../__mocks__/tx';

import {
  addOperation,
  getContractCreatedFee,
  getContractCreatedOperations,
  getFee,
  getFeeFromReceipts,
  getFromAddress,
  getGasUsed,
  getGasUsedContractCreated,
  getGasUsedFromReceipts,
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
  getOutputsVariable,
  getPayProducerOperations,
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
  getTransferOperations,
  getType,
  isStatus,
  isStatusFailure,
  isStatusPending,
  isStatusSuccess,
  isType,
  isTypeCreate,
  isTypeMint,
  isTypeScript,
  parseTx,
} from './tx';
import { OperationName, TxStatus, TxType } from './tx.types';

import { reparse } from '~/systems/Core/utils/json';

describe('Tx util', () => {
  describe('getStatus', () => {
    it('should return correct status', () => {
      expect(getStatus('FailureStatus')).toEqual(TxStatus.failure);
      expect(getStatus('SuccessStatus')).toEqual(TxStatus.success);
      expect(getStatus('SubmittedStatus')).toEqual(TxStatus.pending);
      expect(getStatus('SqueezedOutStatus')).toEqual(TxStatus.squeezedOut);
      expect(getStatus()).toBeUndefined();
    });
    it('should isStatus return by type', () => {
      expect(isStatus('SuccessStatus', TxStatus.success)).toBeTruthy();
      expect(isStatus('SubmittedStatus', TxStatus.pending)).toBeTruthy();
      expect(isStatus('FailureStatus', TxStatus.failure)).toBeTruthy();
      expect(isStatus('SqueezedOutStatus', TxStatus.squeezedOut)).toBeTruthy();

      expect(isStatus('SuccessStatus', TxStatus.pending)).toBeFalsy();
      expect(isStatus('SubmittedStatus', TxStatus.failure)).toBeFalsy();
      expect(isStatus('FailureStatus', TxStatus.success)).toBeFalsy();
      expect(isStatus('SqueezedOutStatus', TxStatus.success)).toBeFalsy();
    });
    it('should isStatusSuccess return if is success', () => {
      expect(isStatusSuccess('SuccessStatus')).toBeTruthy();
      expect(isStatusSuccess('SubmittedStatus')).toBeFalsy();
      expect(isStatusSuccess('FailureStatus')).toBeFalsy();
    });
    it('should isStatusPending return if is pending', () => {
      expect(isStatusPending('SubmittedStatus')).toBeTruthy();
      expect(isStatusPending('SuccessStatus')).toBeFalsy();
      expect(isStatusPending('FailureStatus')).toBeFalsy();
    });
    it('should isStatusFailure return if is script', () => {
      expect(isStatusFailure('FailureStatus')).toBeTruthy();
      expect(isStatusFailure('SuccessStatus')).toBeFalsy();
      expect(isStatusFailure('SubmittedStatus')).toBeFalsy();
    });
  });

  describe('getInputs', () => {
    it('should getInputsCoin return correct inputs', () => {
      const inputs = getInputsCoin(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || []
      );

      expect(inputs.length).toEqual(2);
      expect(inputs[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.inputCoin
      );
    });

    it('should getInputsCoin return empty', () => {
      const inputs = getInputsCoin(
        MOCK_TRANSACTION_MINT.transaction.inputs || []
      );
      expect(inputs.length).toEqual(0);
    });

    it('should getInputsContract return correct inputs', () => {
      const inputs = getInputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || []
      );
      expect(inputs.length).toEqual(1);
      expect(inputs[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.inputContract
      );
    });

    it('should getInputsContract return empty', () => {
      const inputs = getInputsContract(
        MOCK_TRANSACTION_CREATE_CONTRACT.transaction.inputs || []
      );
      expect(inputs.length).toEqual(0);
    });

    it('should getInputsMessage return correct inputs', () => {
      // TODO: add test here.. not sure how to test this as we don't support message inputs/outputs in screens yet
      expect(false);
    });

    it('should getInputsMessage return empty', () => {
      const inputs = getInputsMessage(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || []
      );
      expect(inputs.length).toEqual(0);
    });

    it('should getInputContractFromIndex return correct inputs', () => {
      const contractOutput = getOutputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      )?.[0];
      const input = getInputContractFromIndex(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || [],
        contractOutput.inputIndex
      );
      expect(input).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.inputContract
      );
    });

    it('should getInputContractFromIndex return empty', () => {
      const contractOutput = getOutputsContract(
        MOCK_TRANSACTION_CREATE_CONTRACT.transaction.outputs || []
      )?.[0];
      const input = getInputContractFromIndex(
        MOCK_TRANSACTION_CREATE_CONTRACT.transaction.inputs || [],
        contractOutput?.inputIndex
      );
      expect(input).toBeUndefined();
    });
  });

  describe('getFromAddress', () => {
    it('should return correct fromAddress', () => {
      const fromAddress = MOCK_TRANSACTION_CONTRACT_CALL_PARTS.inputCoin?.owner;
      expect(
        getFromAddress(MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || [])
      ).toEqual(fromAddress);
    });

    it('should return fromAddress from Mint transaction', () => {
      expect(
        getFromAddress(MOCK_TRANSACTION_MINT.transaction.inputs || [])
      ).toBeUndefined();
    });
  });

  describe('getOutputs', () => {
    it('should getOutputsCoin return correct outputs', () => {
      const outputs = getOutputsCoin(
        MOCK_TRANSACTION_MINT.transaction.outputs || []
      );

      expect(outputs.length).toEqual(1);
      expect(outputs[0]).toStrictEqual(MOCK_TRANSACTION_MINT_PARTS.outputCoin);
    });

    it('should getOutputsCoin return empty', () => {
      const outputs = getOutputsCoin(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      );
      expect(outputs.length).toEqual(0);
    });

    it('should getOutputsContract return correct outputs', () => {
      const outputs = getOutputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      );

      expect(outputs.length).toEqual(1);
      expect(outputs[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.outputContract
      );
    });

    it('should getOutputsContract return empty', () => {
      const outputs = getOutputsContract(
        MOCK_TRANSACTION_CREATE_CONTRACT.transaction.outputs || []
      );
      expect(outputs.length).toEqual(0);
    });

    it('should getOutputsMessage return correct outputs', () => {
      // TODO: add test here.. not sure how to test this as we don't support message inputs/outputs in screens yet
      expect(false);
    });

    it('should getOutputsMessage return empty', () => {
      const outputs = getOutputsMessage(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      );
      expect(outputs.length).toEqual(0);
    });

    it('should getOutputsVariable return correct outputs', () => {
      const outputs = getOutputsVariable(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      );

      expect(outputs.length).toEqual(1);
      expect(outputs[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.outputVariable
      );
    });

    it('should getOutputsVariable return empty', () => {
      const outputs = getOutputsVariable(
        MOCK_TRANSACTION_CREATE_CONTRACT.transaction.outputs || []
      );
      expect(outputs.length).toEqual(0);
    });

    it('should getOutputsChange return correct outputs', () => {
      const outputs = getOutputsChange(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      );

      expect(outputs.length).toEqual(1);
      expect(outputs[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.outputChange
      );
    });

    it('should getOutputsChange return empty', () => {
      const outputs = getOutputsChange(
        MOCK_TRANSACTION_MINT.transaction.outputs || []
      );
      expect(outputs.length).toEqual(0);
    });

    it('should getOutputsContractCreated return correct outputs', () => {
      const outputs = getOutputsContractCreated(
        MOCK_TRANSACTION_CREATE_CONTRACT.transaction.outputs || []
      );

      expect(outputs.length).toEqual(1);
      expect(outputs[0]).toStrictEqual(
        MOCK_TRANSACTION_CREATE_CONTRACT_PARTS.outputContractCreated
      );
    });

    it('should getOutputsContractCreated return empty', () => {
      const outputs = getOutputsContractCreated(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      );
      expect(outputs.length).toEqual(0);
    });
  });

  describe('getReceipts', () => {
    it('should getReceiptsCall return correct receipts', () => {
      const receipts = getReceiptsCall(MOCK_TRANSACTION_CONTRACT_CALL.receipts);

      expect(receipts.length).toEqual(1);
      expect(receipts[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptCall
      );
    });

    it('should getReceiptsCall return empty', () => {
      const receipts = getReceiptsCall(MOCK_TRANSACTION_TRANSFER.receipts);

      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsReturn return correct receipts', () => {
      const receipts = getReceiptsReturn(MOCK_TRANSACTION_TRANSFER.receipts);

      expect(receipts.length).toEqual(1);
      expect(receipts[0]).toStrictEqual(
        MOCK_TRANSACTION_TRANSFER_PARTS.receiptReturn
      );
    });

    it('should getReceiptsReturn return empty', () => {
      const receipts = getReceiptsReturn(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );
      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsReturnData return correct receipts', () => {
      const receipts = getReceiptsReturnData(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );

      expect(receipts.length).toEqual(2);
      expect(receipts[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptReturnData[0]
      );
      expect(receipts[1]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptReturnData[1]
      );
    });

    it('should getReceiptsReturnData return empty', () => {
      const receipts = getReceiptsReturnData(
        MOCK_TRANSACTION_TRANSFER.receipts
      );

      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsPanic return correct receipts', () => {
      expect(false);
    });

    it('should getReceiptsPanic return empty', () => {
      const receipts = getReceiptsPanic(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );
      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsRevert return correct receipts', () => {
      expect(false);
    });

    it('should getReceiptsRevert return empty', () => {
      const receipts = getReceiptsRevert(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );
      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsLog return correct receipts', () => {
      expect(false);
    });

    it('should getReceiptsLog return empty', () => {
      const receipts = getReceiptsLog(MOCK_TRANSACTION_CONTRACT_CALL.receipts);
      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsLogData return correct receipts', () => {
      expect(false);
    });

    it('should getReceiptsLogData return empty', () => {
      const receipts = getReceiptsLogData(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );
      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsTransfer return correct receipts', () => {
      expect(false);
    });

    it('should getReceiptsTransfer return empty', () => {
      const receipts = getReceiptsTransfer(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );
      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsTransferOut return correct receipts', () => {
      const receipts = getReceiptsTransferOut(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );

      expect(receipts.length).toEqual(1);
      expect(receipts[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptTransferOut
      );
    });

    it('should getReceiptsTransferOut return empty', () => {
      const receipts = getReceiptsTransferOut(
        MOCK_TRANSACTION_TRANSFER.receipts
      );

      expect(receipts.length).toEqual(0);
    });

    it('should getReceiptsScriptResult return correct receipts', () => {
      const receipts = getReceiptsScriptResult(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );

      expect(receipts.length).toEqual(1);
      expect(receipts[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptScriptResult
      );
    });

    it('should getReceiptsScriptResult return empty', () => {
      expect(false);
    });

    it('should getReceiptsMessageOut return correct receipts', () => {
      expect(false);
    });

    it('should getReceiptsMessageOut return empty', () => {
      const receipts = getReceiptsMessageOut(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts
      );
      expect(receipts.length).toEqual(0);
    });
  });

  describe('getType', () => {
    it('should getType return correct type', () => {
      expect(getType(TransactionType.Create)).toEqual(TxType.create);
      expect(getType(TransactionType.Script)).toEqual(TxType.script);
      expect(getType(TransactionType.Mint)).toEqual(TxType.mint);
    });
    it('should isType return by type', () => {
      expect(isType(TransactionType.Create, TxType.create)).toBeTruthy();
      expect(isType(TransactionType.Script, TxType.script)).toBeTruthy();
      expect(isType(TransactionType.Mint, TxType.mint)).toBeTruthy();
      expect(isType(TransactionType.Script, TxType.create)).toBeFalsy();
      expect(isType(TransactionType.Mint, TxType.script)).toBeFalsy();
      expect(isType(TransactionType.Create, TxType.mint)).toBeFalsy();
    });
    it('should isTypeMint return if is mint', () => {
      expect(isTypeMint(TransactionType.Mint)).toBeTruthy();
      expect(isTypeMint(TransactionType.Script)).toBeFalsy();
      expect(isTypeMint(TransactionType.Create)).toBeFalsy();
    });
    it('should isTypeCreate return if is create', () => {
      expect(isTypeCreate(TransactionType.Create)).toBeTruthy();
      expect(isTypeCreate(TransactionType.Script)).toBeFalsy();
      expect(isTypeCreate(TransactionType.Mint)).toBeFalsy();
    });
    it('should isTypeScript return if is script', () => {
      expect(isTypeScript(TransactionType.Script)).toBeTruthy();
      expect(isTypeScript(TransactionType.Mint)).toBeFalsy();
      expect(isTypeScript(TransactionType.Create)).toBeFalsy();
    });
  });

  describe('addOperation', () => {
    const fromAddress = getFromAddress(
      MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || []
    );
    const OPERATION_CONTRACT_CALL = {
      name: OperationName.contractCall,
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
      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(OPERATION_CONTRACT_CALL);
    });

    it('should not stack operations with different name / from / to', () => {
      const baseOperations = addOperation([], OPERATION_CONTRACT_CALL);
      const operationsDifName = addOperation(baseOperations, {
        ...OPERATION_CONTRACT_CALL,
        name: OperationName.contractCreated,
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
    it('should getContractCreatedOperations return operations from transaction Create', () => {
      const operations = getContractCreatedOperations({
        inputs: MOCK_TRANSACTION_CREATE_CONTRACT.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_CREATE_CONTRACT.transaction.outputs || [],
      });
      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(
        MOCK_TRANSACTION_CREATE_CONTRACT.tx.operations[0]
      );
    });

    it('should getContractCreatedOperations return empty', () => {
      const operations = getContractCreatedOperations({
        inputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || [],
      });
      expect(operations.length).toEqual(0);
    });

    it('should getPayProducerOperations return operations from transaction Create', () => {
      const operations = getPayProducerOperations(
        MOCK_TRANSACTION_MINT.transaction.outputs || []
      );
      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(
        MOCK_TRANSACTION_MINT.tx.operations[0]
      );
    });

    it('should getPayProducerOperations return empty', () => {
      const operationsContract = getPayProducerOperations(
        MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || []
      );
      expect(operationsContract.length).toEqual(0);
      const operationsCreate = getPayProducerOperations(
        MOCK_TRANSACTION_CREATE_CONTRACT.transaction.outputs || []
      );
      expect(operationsCreate.length).toEqual(0);
    });

    it('should getTransferOperations return transfer operations', () => {
      const operations = getTransferOperations({
        inputs: MOCK_TRANSACTION_TRANSFER.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_TRANSFER.transaction.outputs || [],
      });
      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(
        MOCK_TRANSACTION_TRANSFER.tx.operations[0]
      );
    });

    it('should getTransferOperations return empty', () => {
      const operations = getTransferOperations({
        inputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || [],
      });
      expect(operations.length).toEqual(0);
    });

    it('should getOperations return contract call operations', () => {
      const operations = getOperations({
        transactionType: MOCK_TRANSACTION_CONTRACT_CALL.transaction.type,
        inputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || [],
        receipts: MOCK_TRANSACTION_CONTRACT_CALL.receipts || [],
      });
      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(
        MOCK_TRANSACTION_CONTRACT_CALL.tx.operations[0]
      );
    });

    it('should getOperations return transfer operations', () => {
      const operations = getOperations({
        transactionType: MOCK_TRANSACTION_TRANSFER.transaction.type,
        inputs: MOCK_TRANSACTION_TRANSFER.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_TRANSFER.transaction.outputs || [],
        receipts: MOCK_TRANSACTION_TRANSFER.receipts || [],
      });
      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(
        MOCK_TRANSACTION_TRANSFER.tx.operations[0]
      );
    });

    it('should getOperations return mint operations', () => {
      const operations = getOperations({
        transactionType: MOCK_TRANSACTION_MINT.transaction.type,
        inputs: MOCK_TRANSACTION_MINT.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_MINT.transaction.outputs || [],
        receipts: MOCK_TRANSACTION_MINT.receipts || [],
      });

      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(
        MOCK_TRANSACTION_MINT.tx.operations[0]
      );
    });

    it('should getOperations return contract created operations', () => {
      const operations = getOperations({
        transactionType: MOCK_TRANSACTION_CREATE_CONTRACT.transaction.type,
        inputs: MOCK_TRANSACTION_CREATE_CONTRACT.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_CREATE_CONTRACT.transaction.outputs || [],
        receipts: MOCK_TRANSACTION_CREATE_CONTRACT.receipts || [],
      });

      expect(operations.length).toEqual(1);
      expect(operations[0]).toStrictEqual(
        MOCK_TRANSACTION_CREATE_CONTRACT.tx.operations[0]
      );
    });
  });

  describe('getTotalAssetsSent', () => {
    // TODO: add other combinations of only 1 asset, 2 asset equals, different assets. check sums etcv
    it('should getTotalAssetsSent return total assets from contract call', () => {
      const totalAssetsSent = getTotalAssetsSent({
        transactionType:
          MOCK_TRANSACTION_CONTRACT_CALL.transaction.type ||
          TransactionType.Script,
        inputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.inputs || [],
        outputs: MOCK_TRANSACTION_CONTRACT_CALL.transaction.outputs || [],
        receipts: MOCK_TRANSACTION_CONTRACT_CALL.receipts || [],
      });
      expect(totalAssetsSent[0]?.assetId).toEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptCall?.assetId
      );
      expect(totalAssetsSent[0]?.amount.valueOf()).toEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptCall?.amount.valueOf()
      );
    });
  });

  describe('getGasUsed', () => {
    it('should getGasUsedFromReceipts return gasUsed from contract call transaction', () => {
      const gasUsed = getGasUsedFromReceipts(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts || []
      );
      expect(gasUsed.valueOf()).toEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptScriptResult.gasUsed.valueOf()
      );
    });

    it('should getGasUsedFromReceipts return empty', () => {
      const gasUsed = getGasUsedFromReceipts(
        MOCK_TRANSACTION_CONTRACT_CALL.receipts?.filter(
          (r) => r.type !== ReceiptType.ScriptResult
        ) || []
      );
      expect(gasUsed.valueOf()).toEqual(bn(0).valueOf());

      const gasUsedEmpty = getGasUsedFromReceipts([]);
      expect(gasUsedEmpty.valueOf()).toEqual(bn(0).valueOf());
    });

    it('should getGasUsedContractCreated return gasUsed from contract call transaction', () => {
      const gasUsed = getGasUsedContractCreated({
        transaction: MOCK_TRANSACTION_CREATE_CONTRACT.transaction,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });

      expect(gasUsed.valueOf()).toEqual(
        MOCK_TRANSACTION_CREATE_CONTRACT.tx.gasUsed.valueOf()
      );
    });

    it('should getGasUsedContractCreated return empty', () => {
      const gasUsed = getGasUsedContractCreated({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL.transaction,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(gasUsed.valueOf()).toEqual(bn(0).valueOf());
    });

    it('should getGasUsed return gasUsed from receipts for script transactions', () => {
      const gasUsed = getGasUsed({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL.transaction,
        receipts: MOCK_TRANSACTION_CONTRACT_CALL.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(gasUsed.valueOf()).toEqual(
        MOCK_TRANSACTION_CONTRACT_CALL_PARTS.receiptScriptResult.gasUsed.valueOf()
      );
    });

    it('should getGasUsed return gasUsed from create contract transaction (bytes)', () => {
      const gasUsed = getGasUsed({
        transaction: MOCK_TRANSACTION_CREATE_CONTRACT.transaction,
        receipts: MOCK_TRANSACTION_CREATE_CONTRACT.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(gasUsed.valueOf()).toEqual(
        MOCK_TRANSACTION_CREATE_CONTRACT.tx.gasUsed.valueOf()
      );
    });

    it('should getGasUsed return empty for mint transaction', () => {
      const gasUsed = getGasUsed({
        transaction: MOCK_TRANSACTION_MINT.transaction,
        receipts: MOCK_TRANSACTION_MINT.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(gasUsed.valueOf()).toEqual(
        MOCK_TRANSACTION_MINT.tx.gasUsed.valueOf()
      );
    });
  });

  describe('getFee', () => {
    it('should getContractCreatedFee return fee from contract created transaction', () => {
      const fee = getContractCreatedFee({
        transaction: MOCK_TRANSACTION_CREATE_CONTRACT.transaction,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(
        MOCK_TRANSACTION_CREATE_CONTRACT.tx.fee.valueOf()
      );
    });

    it('should getContractCreatedFee return zero for mint / script transaction', () => {
      const feeContractCall = getContractCreatedFee({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL.transaction,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(feeContractCall.valueOf()).toEqual(bn(0).valueOf());

      const feeMint = getContractCreatedFee({
        transaction: MOCK_TRANSACTION_MINT.transaction,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(feeMint.valueOf()).toEqual(bn(0).valueOf());
    });

    it('should getFeeFromReceipts return fee from receipts', () => {
      const fee = getFeeFromReceipts({
        gasPrice: bn(MOCK_TRANSACTION_CONTRACT_CALL.transaction.gasPrice),
        receipts: MOCK_TRANSACTION_CONTRACT_CALL.receipts || [],
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(
        MOCK_TRANSACTION_CONTRACT_CALL.tx.fee.valueOf()
      );
    });

    it('should getFeeFromReceipts return zero when has no receipts', () => {
      const fee = getFeeFromReceipts({
        gasPrice: bn(MOCK_TRANSACTION_CONTRACT_CALL.transaction.gasPrice),
        receipts: [],
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(bn(0).valueOf());
    });

    it('should getFee return fee from create contract transaction (from bytes)', () => {
      const fee = getFee({
        transaction: MOCK_TRANSACTION_CREATE_CONTRACT.transaction,
        receipts: MOCK_TRANSACTION_CREATE_CONTRACT.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(
        MOCK_TRANSACTION_CREATE_CONTRACT.tx.fee.valueOf()
      );
    });

    it('should getFee return fee from contract call transaction', () => {
      const fee = getFee({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL.transaction,
        receipts: MOCK_TRANSACTION_CONTRACT_CALL.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(
        MOCK_TRANSACTION_CONTRACT_CALL.tx.fee.valueOf()
      );
    });

    it('should getFee return fee from transfer transaction', () => {
      const fee = getFee({
        transaction: MOCK_TRANSACTION_TRANSFER.transaction,
        receipts: MOCK_TRANSACTION_TRANSFER.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(MOCK_TRANSACTION_TRANSFER.tx.fee.valueOf());
    });

    it('should getFee return fee from mint transaction (zero)', () => {
      const fee = getFee({
        transaction: MOCK_TRANSACTION_MINT.transaction,
        receipts: MOCK_TRANSACTION_MINT.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(MOCK_TRANSACTION_MINT.tx.fee.valueOf());
    });
  });

  describe('parseTx', () => {
    it('should parseTx return correct data for contract call transaction', () => {
      const tx = parseTx({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL.transaction,
        receipts: MOCK_TRANSACTION_CONTRACT_CALL.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
        gqlStatus: 'SuccessStatus',
        id: MOCK_TRANSACTION_CONTRACT_CALL.tx.id,
        time: MOCK_TRANSACTION_CONTRACT_CALL.tx.time,
      });

      expect(reparse(tx)).toStrictEqual(
        reparse(MOCK_TRANSACTION_CONTRACT_CALL.tx)
      );
    });

    it('should parseTx return correct data for transfer transaction', () => {
      const tx = parseTx({
        transaction: MOCK_TRANSACTION_TRANSFER.transaction,
        receipts: MOCK_TRANSACTION_TRANSFER.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
        gqlStatus: 'SuccessStatus',
        id: MOCK_TRANSACTION_TRANSFER.tx.id,
      });

      expect(reparse(tx)).toStrictEqual(reparse(MOCK_TRANSACTION_TRANSFER.tx));
    });

    it('should parseTx return correct data for create contract transaction', () => {
      const tx = parseTx({
        transaction: MOCK_TRANSACTION_CREATE_CONTRACT.transaction,
        receipts: MOCK_TRANSACTION_CREATE_CONTRACT.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
        gqlStatus: 'SuccessStatus',
        id: MOCK_TRANSACTION_CREATE_CONTRACT.tx.id,
      });
      expect(reparse(tx)).toStrictEqual(
        reparse(MOCK_TRANSACTION_CREATE_CONTRACT.tx)
      );
    });

    it('should parseTx return correct data for mint transaction', () => {
      const tx = parseTx({
        transaction: MOCK_TRANSACTION_MINT.transaction,
        receipts: MOCK_TRANSACTION_MINT.receipts || [],
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
        gqlStatus: 'SuccessStatus',
        id: MOCK_TRANSACTION_MINT.tx.id,
      });
      expect(reparse(tx)).toStrictEqual(reparse(MOCK_TRANSACTION_MINT.tx));
    });
  });
});
