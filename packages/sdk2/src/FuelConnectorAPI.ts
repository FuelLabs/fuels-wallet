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
  'addNetwork',
  'switchNetwork',
  'currentNetwork',
  // ABI methods
  'addABI',
  'getABI',
  'hasABI',
];

export const FUEL_CONNECTOR_EVENTS = [
  // Connection events
  'connection',
  // Account events
  'accounts',
  'currentAccount',
  // Network events
  'network',
  'currentNetwork',
];

export const TARGET_FUEL_CONNECTOR_EVENT = 'FuelConnector';
