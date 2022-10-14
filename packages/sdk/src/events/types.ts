export type MessagePost<T = void> = Omit<EventMessage<T>, 'origin'>;

export type EventConnector<MetadataType = void> = {
  postMessage: (eventMessage: MessagePost<MetadataType>) => void;
  setupListener: (
    receive: (eventMessage: EventMessage<MetadataType>) => void
  ) => void;
};

export type EventsOptions<T> = {
  id: string;
  name: string;
  connector: EventConnector<T>;
  interceptor?: (
    message: EventMessage<T>,
    send: (eventName: string, data?: any) => void
  ) => Promise<boolean>;
};

export type EventMessage<MetadataType = void> = {
  id: string;
  name: string;
  event: string;
  origin: string;
  data?: any;
  metadata?: MetadataType;
  namespace?: string;
};
