import type { FuelEventMessage, FuelMessage, FuelRPCMessage } from './types';

export function isFuelRPCMessage(
  eventMessage: FuelMessage
): eventMessage is FuelRPCMessage {
  if ((eventMessage as FuelRPCMessage).request) {
    return true;
  }
  return false;
}

export function isFuelEventMessage<T>(
  eventMessage: FuelMessage<T>
): eventMessage is FuelEventMessage<T> {
  if ((eventMessage as FuelEventMessage<T>).event) {
    return true;
  }
  return false;
}
