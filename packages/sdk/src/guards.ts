import type { FuelEventMessage, FuelMessage, FuelRPCMessage } from './types';

export function isFuelRPCMessage(
  eventMessage: FuelMessage
): eventMessage is FuelRPCMessage {
  if ((eventMessage as FuelRPCMessage).request) {
    return true;
  }
  return false;
}

export function isFuelEventMessage(
  eventMessage: FuelMessage
): eventMessage is FuelEventMessage {
  if ((eventMessage as FuelEventMessage).type === 'event') {
    return true;
  }
  return false;
}
