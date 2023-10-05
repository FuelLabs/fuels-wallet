import type { FuelConnectorEvent, FuelLoadedEvent } from './utils/events';

// Extend global events  with Fuel custom events
interface FuelDocumentEvents extends DocumentEventMap {
  FuelLoaded: FuelLoadedEvent;
  FuelConnector: FuelConnectorEvent;
}

declare global {
  interface Window {
    addEventListener<K extends keyof FuelDocumentEvents>(
      type: K,
      listener: (this: Document, ev: FuelDocumentEvents[K]) => void
    ): void;
    removeEventListener<K extends keyof FuelDocumentEvents>(
      type: K,
      listener: (this: Document, ev: FuelDocumentEvents[K]) => void
    ): void;
    dispatchEvent<K extends keyof FuelDocumentEvents>(
      ev: FuelDocumentEvents[K]
    ): void;
  }
}
