import type { TransactionRequestLike } from 'fuels';
import { hexlify, Address, InputType } from 'fuels';

export function getTransactionSigner(transaction: TransactionRequestLike) {
  const address = transaction.inputs?.map((i) => {
    switch (i.type) {
      case InputType.Message:
        return i.recipient;
      case InputType.Coin:
        return i.owner;
      default:
        return undefined;
    }
  })[0];

  if (!address) {
    throw new Error('No possible signer found!');
  }

  return Address.fromB256(hexlify(address)).toString();
}
