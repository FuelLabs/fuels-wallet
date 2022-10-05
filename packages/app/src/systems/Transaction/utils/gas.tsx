import type { ReceiptScriptResult } from 'fuels';
import { bn } from 'fuels';
import type { Maybe } from 'yup/lib/types';

import type { Transaction } from '../types';

export function getGasUsedFromTx(tx?: Maybe<Transaction>) {
  return (tx?.receipts ?? []).reduce((val, receipt) => {
    const r = receipt as ReceiptScriptResult;
    return r?.gasUsed ? val.add(r.gasUsed) : val;
  }, bn(0));
}
