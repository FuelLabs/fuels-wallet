import { createUUID } from '@fuel-wallet/connections';
import type { NetworkData } from '@fuel-wallet/types';
import { compare } from 'compare-versions';
import { type NodeInfo, Provider } from 'fuels';
import { MIN_NODE_VERSION } from '~/config';
import { db } from '~/systems/Core/utils/database';

import { isValidNetworkUrl } from '../utils';

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
  editNetwork: {
    id: string;
  };
  updateNetwork: {
    id: string;
    data: Partial<NetworkData>;
  };
  selectNetwork: {
    id: string;
  };
  removeNetwork: {
    id: string;
  };
  getNodeInfo: {
    providerUrl: string;
  };
  getChainInfo: {
    providerUrl: string;
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

  static async addNetwork(input: NetworkInputs['addNetwork']) {
    await this.validateAddNetwork(input);
    return db.transaction('rw', db.networks, async () => {
      const count = await db.networks.count();
      const inputToAdd = {
        ...input.data,
        ...(count === 0 && { isSelected: true }),
        id: createUUID(),
      };
      const id = await db.networks.add(inputToAdd);
      return db.networks.get(id) as Promise<NetworkData>;
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
      return db.networks.get(input.id) as Promise<NetworkData>;
    });
  }

  static async addDefaultNetworks() {
    const providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;
    const chainInfo = await NetworkService.getChainInfo({
      providerUrl,
    }).catch(() => ({
      name: 'Localhost',
    }));
    return NetworkService.addNetwork({
      data: {
        name: chainInfo.name,
        url: providerUrl,
      },
    });
  }

  static clearNetworks() {
    return db.transaction('rw', db.networks, async () => {
      return db.networks.clear();
    });
  }

  static async getChainInfo(input: NetworkInputs['getChainInfo']) {
    const provider = await Provider.create(input.providerUrl);
    return provider.getChain();
  }

  static async getNodeInfo(input: NetworkInputs['getNodeInfo']) {
    const provider = await Provider.create(input.providerUrl);
    return provider.fetchNode();
  }

  static async validateAddNetwork(input: NetworkInputs['addNetwork']) {
    const { name, url } = input.data;
    if (!isValidNetworkUrl(url)) {
      throw new Error('Invalid network URL');
    }
    let nodeInfo: NodeInfo;
    try {
      const provider = await Provider.create(url);
      nodeInfo = await provider.fetchNode();
    } catch (_err) {
      throw new Error(
        `Network version is not compatible with >=${MIN_NODE_VERSION} required by the Wallet`
      );
    }
    if (compare(nodeInfo.nodeVersion, MIN_NODE_VERSION, '<')) {
      throw new Error(
        `Network version is not compatible with >=${MIN_NODE_VERSION} required by the Wallet`
      );
    }
    const collection = await db.transaction('r', db.networks, async () => {
      return db.networks
        .where('url')
        .equalsIgnoreCase(url)
        .or('name')
        .equalsIgnoreCase(name);
    });
    const isExistingNetwork = await collection.count();
    if (isExistingNetwork) {
      throw new Error('Network with Name or URL already exists');
    }
  }
}
