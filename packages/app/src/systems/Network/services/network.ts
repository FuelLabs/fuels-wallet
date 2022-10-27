import type { Network } from '@fuels-wallet/types';
import { uniqueId } from 'xstate/lib/utils';

import { db } from '~/systems/Core';

export type NetworkInputs = {
  getNetwork: {
    id: string;
  };
  addNetwork: {
    data: {
      name: string;
      url: string;
    };
  };
  updateNetwork: {
    id: string;
    data: Partial<Network>;
  };
  selectNetwork: {
    id: string;
  };
  removeNetwork: {
    id: string;
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
        id: uniqueId(),
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
      const networks = (await NetworkService.getNetworks()) || [];
      if (networks.length === 1) {
        throw new Error('You need to stay with at least one network');
      }
      const network = await NetworkService.getNetwork(input);
      if (network?.isSelected) {
        const nextNetwork = networks.filter((i) => i.id !== input.id)[0];
        await NetworkService.selectNetwork({ id: nextNetwork.id as string });
      }
      await db.networks.where(input).delete();
      return network?.id;
    });
  }

  static getSelectedNetwork() {
    return db.transaction('r', db.networks, async () => {
      return (await db.networks.toArray()).find((i) => i.isSelected);
    });
  }

  static selectNetwork(input: NetworkInputs['selectNetwork']) {
    return db.transaction('rw', db.networks, async () => {
      const selected = await db.networks
        .filter((i) => Boolean(i.isSelected))
        .first();
      if (selected?.id) {
        await NetworkService.updateNetwork({
          id: selected.id,
          data: { isSelected: false },
        });
      }
      await NetworkService.updateNetwork({
        id: input.id,
        data: { isSelected: true },
      });
      return db.networks.get(input.id);
    });
  }

  static addFirstNetwork() {
    const isProd =
      import.meta.env.PROD || import.meta.env.NODE_ENV === 'production';
    return NetworkService.addNetwork({
      data: {
        name: isProd ? 'Testnet' : 'Localhost',
        url: import.meta.env.VITE_FUEL_PROVIDER_URL,
      },
    });
  }

  static clearNetworks() {
    return db.transaction('rw', db.networks, async () => {
      return db.networks.clear();
    });
  }
}
