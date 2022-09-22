import type { Network } from '../types';

import { db } from '~/systems/Core';

export type NetworkInputs = {
  getNetwork: {
    id: number;
  };
  addNetwork: {
    data: {
      name: string;
      url: string;
    };
  };
  updateNetwork: {
    id: number;
    data: Partial<Network>;
  };
  setSelected: {
    id: number;
  };
  removeNetwork: {
    id: number;
  };
};

export class NetworkService {
  static getNetworks() {
    return db.transaction('r', db.networks, async () => {
      return db.networks.toArray();
    });
  }

  static getNetwork(input: NetworkInputs['getNetwork']) {
    return db.transaction('r', db.networks, async () => {
      return db.networks.get({ id: input.id });
    });
  }

  static addNetwork(input: NetworkInputs['addNetwork']) {
    return db.transaction('rw', db.networks, async () => {
      const count = await db.networks.count();
      const id = await db.networks.add({
        ...input.data,
        ...(count === 0 && { isSelected: true }),
      });
      return db.networks.get(id);
    });
  }

  static updateNetwork(input: NetworkInputs['updateNetwork']) {
    if (!input.data) {
      throw new Error('Network.data undefined');
    }
    if (!input.id) {
      throw new Error('Network.id undefined');
    }
    return db.transaction('rw', db.networks, async () => {
      await db.networks.update(input.id, input.data);
      return db.networks.get(input.id);
    });
  }

  static removeNetwork(input: NetworkInputs['removeNetwork']) {
    return db.transaction('rw', db.networks, async () => {
      return db.networks.where(input).delete();
    });
  }

  static setSelected(input: NetworkInputs['setSelected']) {
    return db.transaction('rw', db.networks, async () => {
      const selected = await db.networks.filter((i) => Boolean(i.isSelected)).first();
      if (selected?.id) {
        await NetworkService.updateNetwork({ id: selected.id, data: { isSelected: false } });
      }
      await NetworkService.updateNetwork({ id: input.id, data: { isSelected: false } });
      return db.networks.get(input.id);
    });
  }

  static clearNetworks() {
    return db.transaction('rw', db.networks, async () => {
      return db.networks.clear();
    });
  }
}
