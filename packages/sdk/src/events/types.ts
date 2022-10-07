export type EventConnector<MetadataType = void> = {
  postMessage: <DataType = void>(
    eventMessage: EventMessage<DataType, MetadataType>
  ) => void;
  setupListener: <DataType = void>(
    receive: (eventMessage: EventMessage<DataType, MetadataType>) => void
  ) => void;
};

export type EventsOptions<T extends EventConnector<T>> = {
  id: string;
  name: string;
  connector: T;
};

export type EventMessage<DataType = void, MetadataType = void> = {
  id: string;
  name: string;
  event: string;
  data?: DataType;
  metadata?: MetadataType;
};
