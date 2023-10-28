export const FUEL_CONNECTOR_METHODS = [
  // General methods
  'ping',
  'version',
  // Connection methods
  'connect',
  'disconnect',
  'isConnected',
  // Account methods
  'accounts',
  'currentAccount',
  // Signature methods
  'signMessage',
  'sendTransaction',
  // Assets metadata methods
  'assets',
  'addAssets',
  // Network methods
  'networks',
  'currentNetwork',
  'addNetwork',
  'selectNetwork',
  // ABI methods
  'addABI',
  'getABI',
  'hasABI',
];

export enum FuelEvents {
  connectors = 'connectors',
  currentConnector = 'currentConnector',
  connection = 'connection',
  accounts = 'accounts',
  currentAccount = 'currentAccount',
  networks = 'networks',
  currentNetwork = 'currentNetwork',
}

export const FUEL_CONNECTOR_EVENTS = Object.keys(FuelEvents);

export const TARGET_FUEL_CONNECTOR_EVENT = 'FuelConnector';
