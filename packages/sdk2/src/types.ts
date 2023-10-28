/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FuelConnector } from './FuelConnector';
import { TARGET_FUEL_CONNECTOR_EVENT } from './FuelConnectorAPI';

export interface TargetObject {
  on?: (event: string, callback: any) => void;
  off?: (event: string, callback: any) => void;
  emit?: (event: string, data: any) => void;
  addEventListener?: (event: string, callback: any) => void;
  removeEventListener?: (event: string, callback: any) => void;
  postMessage?: (message: string) => void;
}

export interface FuelStorage {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
}

export class FuelConnectorEvent extends CustomEvent<FuelConnector> {
  static type = TARGET_FUEL_CONNECTOR_EVENT;
  constructor(connector: FuelConnector) {
    super(TARGET_FUEL_CONNECTOR_EVENT, { detail: connector });
  }
}
