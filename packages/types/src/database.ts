export interface DatabaseRestartEvent {
  type: 'DB_EVENT';
  payload: {
    event: 'restarted';
  };
}
