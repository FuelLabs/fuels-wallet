import type { FuelWalletError } from '@fuel-wallet/types';

export function parseErrorEmail(errors: FuelWalletError[]) {
  const errorsText = errors.map((error) => JSON.stringify(error)).join('\n');
  const textArea = document?.createElement('textarea');
  textArea.innerText = errorsText;
  return textArea.innerHTML.slice(0, 2000);
}
