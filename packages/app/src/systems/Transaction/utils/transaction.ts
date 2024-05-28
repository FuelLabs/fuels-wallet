import type { ScriptTransactionRequest, TransactionRequest } from 'fuels';

export const isScriptTransactionRequest = (
  txRequest: TransactionRequest
): txRequest is ScriptTransactionRequest => {
  return 'gasLimit' in txRequest;
};
