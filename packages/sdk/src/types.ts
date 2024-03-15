/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Asset } from '@fuel-wallet/types';
import type { FuelConnector, JsonAbi, FuelConnectorEventTypes } from 'fuels';

/****
 * ========================================================================================
 * Helpers
 * ========================================================================================
 */

/**
 * Extract the event argument type from the event type.
 */
export type FuelEventArg<T extends FuelConnectorEvents['type']> = Extract<
  FuelConnectorEventTypes,
  { type: T }
>['data'];

/****
 * ========================================================================================
 * Events
 * ========================================================================================
 */

/**
 * Event trigger when the accounts available to the
 * connection changes.
 *
 * @property {string} type - The event type.
 * @property {string[]} accounts - The accounts addresses
 */
export type AccountsEvent = {
  type: FuelConnectorEventTypes.accounts;
  data: Array<string>;
};

/**
 * Event trigger when the current account on the connector is changed
 * if the account is not authorized for the connection it should trigger with value null.
 *
 * @property {string} type - The event type.
 * @property {string | null} data - The current account selected or null.
 */
export type AccountEvent = {
  type: FuelConnectorEventTypes.currentAccount;
  data: string | null;
};

/**
 * Event trigger when connection status changes. With the new connection status.
 *
 * @event ConnectionEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {boolean} data - The new connection status.
 */
export type ConnectionEvent = {
  type: FuelConnectorEventTypes.connection;
  data: boolean;
};

/**
 * Event trigger when the network selected on the connector is changed.
 * It should trigger even if the network is not available for the connection.
 *
 * @event NetworkEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {Network} data - The network information
 */
export type NetworkEvent = {
  type: FuelConnectorEventTypes.currentNetwork;
  data: Network;
};

/**
 * Event trigger when the network selected on the connector is changed.
 * It should trigger even if the network is not available for the connection.
 *
 * @event NetworksEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {Network[]} data - The network information
 */
export type NetworksEvent = {
  type: FuelConnectorEventTypes.networks;
  data: Network;
};

/**
 * Event trigger when the list of connectors has changed.
 *
 * @event ConnectorsEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {FuelConnector[]} data - The list of connectors
 */
export type ConnectorsEvent = {
  type: FuelConnectorEventTypes.connectors;
  data: Array<FuelConnector>;
};

/**
 * Event trigger when the current connector has changed.
 *
 * @event ConnectorEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {FuelConnector} data - The list of connectors
 */
export type ConnectorEvent = {
  type: FuelConnectorEventTypes.currentConnector;
  data: FuelConnector;
};

/**
 * Event trigger when the assets list of metadata changed.
 *
 * @event AssetsEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {Array<Asset>} data - The list of assets
 */
export type AssetsEvent = {
  type: FuelConnectorEventTypes.assets;
  data: Array<Asset>;
};

/**
 * All the events available to the connector.
 */
export type FuelConnectorEvents =
  | ConnectionEvent
  | NetworkEvent
  | NetworksEvent
  | AccountEvent
  | AccountsEvent
  | ConnectorsEvent
  | ConnectorEvent
  | AssetsEvent;

export type FuelConnectorEventsType = FuelConnectorEvents['type'];

/****
 * ========================================================================================
 * Data Types
 * ========================================================================================
 */

/**
 * @name Version
 */
export type Version = {
  app: string;
  /**
   * Version selection this allow
   * Caret Ranges ^1.2.3 ^0.2.5 ^0.0.4
   * Tilde Ranges ~1.2.3 ~1.2 ~1
   * And Exact Versions 1.0.0
   */
  network: string;
};

/**
 * @name Network
 */
export type Network = {
  /**
   * The name of the network.
   */
  url: string;
  /**
   * The chain id of the network.
   */
  chainId: number;
};

/**
 * ABI that represents a binary code interface from Sway.
 *
 * Read more at: https://docs.fuel.network/docs/specs/abi/json-abi-format/
 */
export type FuelABI = JsonAbi;

/****
 * ========================================================================================
 * Wallet Connector Metadata
 * ========================================================================================
 */

export type ConnectorMetadata = {
  image?:
    | string
    | {
        light: string;
        dark: string;
      };
  install: {
    action: string;
    link: string;
    description: string;
  };
};

/****
 * ========================================================================================
 *  Others
 * ========================================================================================
 */

/**
 * Target Object that represents the global event bus used by Fuel Connector Manager.
 * On browser the default target is the window or document. For other environments
 * the event bus should be provided.
 */
export interface TargetObject {
  on?: (event: string, callback: any) => void;
  off?: (event: string, callback: any) => void;
  emit?: (event: string, data: any) => void;
  addEventListener?: (event: string, callback: any) => void;
  removeEventListener?: (event: string, callback: any) => void;
  postMessage?: (message: string) => void;
}

/**
 * Fuel Storage represent the storage interface used by Fuel Connector Manager.
 * On browser the default storage is the localStorage. For other environments
 * the storage should be provided.
 */
export interface FuelStorage {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
}
