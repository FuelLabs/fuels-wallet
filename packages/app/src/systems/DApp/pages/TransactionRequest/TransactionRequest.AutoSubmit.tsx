import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Services, store } from '~/store';
import type { TxInputs } from '~/systems/Transaction/services';
import type { TransactionRequestFormData } from './TransactionRequest.FormProvider';

export function AutoSubmit() {
  const service = store.useService(Services.txRequest);
  const { watch, handleSubmit } = useFormContext<TransactionRequestFormData>();

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      handleSubmit((data) => {
        const { fees } = data;

        const input: TxInputs['setCustomFees'] = {
          tip: fees.tip.amount,
          gasLimit: fees.gasLimit.amount,
        };

        service.send('SET_CUSTOM_FEES', { input });
      })();
    });

    return () => unsubscribe();
  }, [watch, handleSubmit, service.send]);

  return null;
}
