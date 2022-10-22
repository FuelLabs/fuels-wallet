export type Network = {
  id?: string;
  name: string;
  url: string;
  isSelected?: boolean;
};

export enum NetworkScreen {
  list = 'list',
  update = 'update',
  add = 'add',
}
