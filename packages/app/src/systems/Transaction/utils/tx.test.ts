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
} from '../__mocks__/tx';

import {
  addOperation,
  getFee,
  getFeeFromReceipts,
  getFromAddress,
  getGasUsed,
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
  getStatus,
  getTotalAssetsSent,
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
import { Operations, Status, Type } from './tx.types';

describe('Tx util', () => {
  describe('getStatus', () => {
    it('should return correct status', () => {
      expect(getStatus('FailureStatus')).toEqual(Status.failure);
      expect(getStatus('SuccessStatus')).toEqual(Status.success);
      expect(getStatus('SubmittedStatus')).toEqual(Status.pending);
      expect(getStatus()).toBeUndefined();
    });
    it('should isStatus return by type', () => {
      expect(isStatus('SuccessStatus', Status.success)).toBeTruthy();
      expect(isStatus('SubmittedStatus', Status.pending)).toBeTruthy();
      expect(isStatus('FailureStatus', Status.failure)).toBeTruthy();

      expect(isStatus('SuccessStatus', Status.pending)).toBeFalsy();
      expect(isStatus('SubmittedStatus', Status.failure)).toBeFalsy();
      expect(isStatus('FailureStatus', Status.success)).toBeFalsy();
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
      const inputs = getInputsCoin(MOCK_TRANSACTION_CONTRACT_CALL.inputs || []);
      expect(JSON.stringify(inputs)).toEqual(JSON.stringify([MOCK_INPUT_COIN]));
    });

    it('should getInputsContract return correct inputs', () => {
      const inputs = getInputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL.inputs || []
      );
      expect(JSON.stringify(inputs)).toEqual(
        JSON.stringify([MOCK_INPUT_CONTRACT])
      );
    });

    it('should getInputsMessage return correct inputs', () => {
      const inputs = getInputsMessage(
        MOCK_TRANSACTION_CONTRACT_CALL.inputs || []
      );
      // TODO: add a real test here... for now we don't even support message inputs in screens
      expect(JSON.stringify(inputs)).toEqual(JSON.stringify([]));
    });

    it('should getInputContractFromIndex return correct inputs', () => {
      const contractOutput = getOutputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL.outputs || []
      )?.[0];
      const input = getInputContractFromIndex(
        MOCK_TRANSACTION_CONTRACT_CALL.inputs || [],
        contractOutput.inputIndex
      );
      // TODO: add a real test here... for now we don't even support message inputs in screens
      expect(JSON.stringify(input)).toEqual(
        JSON.stringify(MOCK_INPUT_CONTRACT)
      );
    });
  });

  describe('getFromAddress', () => {
    it('should return correct fromAddress', () => {
      const fromAddress = MOCK_INPUT_COIN.owner;
      expect(
        getFromAddress(MOCK_TRANSACTION_CONTRACT_CALL.inputs || [])
      ).toEqual(fromAddress);
    });
  });

  describe('getOutputs', () => {
    it('should getOutputsCoin return correct outputs', () => {
      const outputs = getOutputsCoin(
        MOCK_TRANSACTION_CONTRACT_CALL.outputs || []
      );
      // TODO: add a real test here...
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    });

    it('should getOutputsContract return correct outputs', () => {
      const outputs = getOutputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL.outputs || []
      );
      // TODO: add a real test here...
      expect(JSON.stringify(outputs)).toEqual(
        JSON.stringify([MOCK_OUTPUT_CONTRACT])
      );
    });

    it('should getOutputsMessage return correct outputs', () => {
      const outputs = getOutputsMessage(
        MOCK_TRANSACTION_CONTRACT_CALL.outputs || []
      );
      // TODO: add a real test here... for now we don't even support message outputs in screens
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    });

    it('should getOutputsVariable return correct outputs', () => {
      // const outputs = getOutputsVariable(MOCK_TRANSACTION_CONTRACT_CALL);
      // TODO: add a real test here... for now we don't even support message outputs in screens
      // expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
      // expect(getOutputsVariable()).toEqual([]);
    });

    it('should getOutputsChange return correct outputs', () => {
      const outputs = getOutputsChange(
        MOCK_TRANSACTION_CONTRACT_CALL.outputs || []
      );
      expect(JSON.stringify(outputs)).toEqual(
        JSON.stringify([MOCK_OUTPUT_CHANGE])
      );
    });

    it('should getOutputsContractCreated return correct outputs', () => {
      const outputs = getOutputsContractCreated(
        MOCK_TRANSACTION_CONTRACT_CALL.outputs || []
      );
      // TODO: add a real test here... for now we don't have this mocked transaction YET
      expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    });
  });

  describe('getReceipts', () => {
    // it('should getReceiptsCall return correct receipts', () => {
    //   const outputs = getReceiptsCall();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsCall()).toEqual([]);
    // });
    // it('should getReceiptsReturn return correct receipts', () => {
    //   const outputs = getReceiptsReturn();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsReturn()).toEqual([]);
    // });
    // it('should getReceiptsReturnData return correct receipts', () => {
    //   const outputs = getReceiptsReturnData();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsReturnData()).toEqual([]);
    // });
    // it('should getReceiptsPanic return correct receipts', () => {
    //   const outputs = getReceiptsPanic();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsPanic()).toEqual([]);
    // });
    // it('should getReceiptsRevert return correct receipts', () => {
    //   const outputs = getReceiptsRevert();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsRevert()).toEqual([]);
    // });
    // it('should getReceiptsLog return correct receipts', () => {
    //   const outputs = getReceiptsLog();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsLog()).toEqual([]);
    // });
    // it('should getReceiptsLogData return correct receipts', () => {
    //   const outputs = getReceiptsLogData();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsLogData()).toEqual([]);
    // });
    // it('should getReceiptsTransfer return correct receipts', () => {
    //   const outputs = getReceiptsTransfer();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsTransfer()).toEqual([]);
    // });
    // it('should getReceiptsTransferOut return correct receipts', () => {
    //   const outputs = getReceiptsTransferOut();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsTransferOut()).toEqual([]);
    // });
    // it('should getReceiptsScriptResult return correct receipts', () => {
    //   const outputs = getReceiptsScriptResult();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsScriptResult()).toEqual([]);
    // });
    // it('should getReceiptsMessageOut return correct receipts', () => {
    //   const outputs = getReceiptsMessageOut();
    //   // TODO: add a real test here... for now we don't have this mocked transaction YET
    //   expect(JSON.stringify(outputs)).toEqual(JSON.stringify([]));
    //   expect(getReceiptsMessageOut()).toEqual([]);
    // });
  });

  describe('getType', () => {
    it('should getType return correct type', () => {
      expect(getType(TransactionType.Create)).toEqual(Type.create);
      expect(getType(TransactionType.Script)).toEqual(Type.script);
      expect(getType(TransactionType.Mint)).toEqual(Type.mint);
    });
    it('should isType return by type', () => {
      expect(isType(TransactionType.Create, Type.create)).toBeTruthy();
      expect(isType(TransactionType.Script, Type.script)).toBeTruthy();
      expect(isType(TransactionType.Mint, Type.mint)).toBeTruthy();
      expect(isType(TransactionType.Script, Type.create)).toBeFalsy();
      expect(isType(TransactionType.Mint, Type.script)).toBeFalsy();
      expect(isType(TransactionType.Create, Type.mint)).toBeFalsy();
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
      MOCK_TRANSACTION_CONTRACT_CALL.inputs || []
    );
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
      const fromAddress = getFromAddress(
        MOCK_TRANSACTION_CONTRACT_CALL?.inputs || []
      );
      const contractOutputs = getOutputsContract(
        MOCK_TRANSACTION_CONTRACT_CALL.outputs || []
      );
      const contractInput = getInputContractFromIndex(
        MOCK_TRANSACTION_CONTRACT_CALL.inputs || [],
        contractOutputs[0].inputIndex
      );

      const operations = getOperations({
        transactionType: MOCK_TRANSACTION_CONTRACT_CALL.type,
        inputs: MOCK_TRANSACTION_CONTRACT_CALL.inputs || [],
        outputs: MOCK_TRANSACTION_CONTRACT_CALL.outputs || [],
        receipts: MOCK_RECEIPTS_CONTRACT_CALL,
      });
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
      const totalAssetsSent = getTotalAssetsSent({
        transactionType: MOCK_TRANSACTION_CONTRACT_CALL.type,
        inputs: MOCK_TRANSACTION_CONTRACT_CALL.inputs || [],
        outputs: MOCK_TRANSACTION_CONTRACT_CALL.outputs || [],
        receipts: MOCK_RECEIPTS_CONTRACT_CALL,
      });
      expect(totalAssetsSent[0]?.assetId).toEqual(MOCK_RECEIPT_CALL.assetId);
      expect(totalAssetsSent[0]?.amount.valueOf()).toEqual(
        MOCK_RECEIPT_CALL.amount.valueOf()
      );
    });
  });

  describe('getGasUsed', () => {
    // add gas used tests for created contract situations
    it('should getGasUsedFromReceipts return gasUsed from tx', () => {
      const gasUsed = getGasUsedFromReceipts(MOCK_RECEIPTS_CONTRACT_CALL);
      expect(gasUsed.valueOf()).toEqual(bn(167824).valueOf());
    });
    it('should getGasUsed return gasUsed from tx', () => {
      const gasUsed = getGasUsed({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL,
        receipts: MOCK_RECEIPTS_CONTRACT_CALL,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(gasUsed.valueOf()).toEqual(bn(167824).valueOf());
    });
  });

  describe('getFee', () => {
    // add other fee situations
    // fee from bytes of contract created transaction
    // fee from transfer operations
    it('should getFeeFromReceipts return fee from receipts', () => {
      const fee = getFeeFromReceipts({
        gasPrice: bn(MOCK_TRANSACTION_CONTRACT_CALL.gasPrice),
        receipts: MOCK_RECEIPTS_CONTRACT_CALL,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(bn(1).valueOf());
    });
    it('should getFee return fee from tx', () => {
      const fee = getFee({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL,
        receipts: MOCK_RECEIPTS_CONTRACT_CALL,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
      });
      expect(fee.valueOf()).toEqual(bn(1).valueOf());
    });
  });

  describe('parseTx', () => {
    it('should parseTx return correct data for contract call transaction', () => {
      const fromAddress = getFromAddress(
        MOCK_TRANSACTION_CONTRACT_CALL.inputs || []
      );

      const tx = parseTx({
        transaction: MOCK_TRANSACTION_CONTRACT_CALL,
        receipts: MOCK_RECEIPTS_CONTRACT_CALL,
        gasPerByte: MOCK_GAS_PER_BYTE,
        gasPriceFactor: MOCK_GAS_PRICE_FACTOR,
        gqlStatus: 'SuccessStatus',
        id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6ade7',
      });

      expect(tx.fee?.toNumber()).toEqual(bn(1).toNumber());
      expect(tx.gasUsed?.toNumber()).toEqual(bn(167824).toNumber());
      expect(tx.id).toEqual(
        '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6ade7'
      );
      expect(tx.status).toEqual(Status.success);
      expect(tx.isStatusSuccess).toEqual(true);
      expect(tx.isStatusPending).toEqual(false);
      expect(tx.isStatusFailure).toEqual(false);
      expect(tx.type).toEqual(Type.script);
      expect(tx.isTypeScript).toEqual(true);
      expect(tx.isTypeCreate).toEqual(false);
      expect(tx.isTypeMint).toEqual(false);
      expect(tx.operations.length).toEqual(1);
      expect(tx.operations[0].name).toEqual(Operations.contractCall);
      expect(tx.operations[0]?.from?.type).toEqual(AddressType.account);
      expect(tx.operations[0]?.from?.address).toEqual(fromAddress);
      expect(tx.operations[0]?.to?.type).toEqual(AddressType.contract);
      expect(tx.operations[0]?.to?.address).toEqual(
        '0x0a98320d39c03337401a4e46263972a9af6ce69ec2f35a5420b1bd35784c74b1'
      );
      expect(tx.operations[0].assetsSent?.[0]?.assetId).toEqual(
        MOCK_RECEIPT_CALL.assetId
      );
      expect(tx.operations[0].assetsSent?.[0]?.amount.valueOf()).toEqual(
        MOCK_RECEIPT_CALL.amount.valueOf()
      );
      expect(tx.totalAssetsSent[0]?.assetId).toEqual(MOCK_RECEIPT_CALL.assetId);
      expect(tx.totalAssetsSent[0]?.amount.valueOf()).toEqual(
        MOCK_RECEIPT_CALL.amount.valueOf()
      );
    });
  });
});
