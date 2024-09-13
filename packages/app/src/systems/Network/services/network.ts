import { createProvider, createUUID } from '@fuel-wallet/connections';
import type { NetworkData } from '@fuel-wallet/types';
import { compare } from 'compare-versions';
import {
  CHAIN_IDS,
  DEVNET_NETWORK_URL,
  type NodeInfo,
  TESTNET_NETWORK_URL,
} from 'fuels';
import { MIN_NODE_VERSION, VITE_FUEL_PROVIDER_URL } from '~/config';
import { db } from '~/systems/Core/utils/database';

import { isNetworkDevnet, isNetworkTestnet, isValidNetworkUrl } from '../utils';

export type NetworkInputs = {
  getNetworkById: {
    id: string;
  };
  getNetworkByChainId: {
    chainId: number;
  };
  getNetworkByUrl: {
    url: string;
  };
  getNetworkByNameOrUrl: {
    name: string;
    url: string;
  };
  addNetwork: {
    data: {
      chainId: number;
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
  validateNetworkExists: {
    name: string;
    url: string;
  };
  validateNetworkVersion: {
    url: string;
  };
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class NetworkService {
  static getNetworks() {
    return db.transaction('r', db.networks, async () => {
      return db.networks.toArray();
    });
  }

  static getNetworkById(input: NetworkInputs['getNetworkById']) {
    return db.transaction('r', db.networks, async () => {
      return db.networks.get({ id: input.id });
    });
  }

  static getNetworkByChainId(input: NetworkInputs['getNetworkByChainId']) {
    return db.transaction('r', db.networks, async () => {
      return db.networks.get({ chainId: input.chainId });
    });
  }

  static getNetworkByUrl(input: NetworkInputs['getNetworkByUrl']) {
    return db.transaction('r', db.networks, async () => {
      return db.networks.get({ url: input.url });
    });
  }

  static getNetworkByNameOrUrl(input: NetworkInputs['getNetworkByNameOrUrl']) {
    return db.transaction('r', db.networks, async () => {
      return db.networks
        .where('url')
        .equalsIgnoreCase(input.url)
        .or('name')
        .equalsIgnoreCase(input.name)
        .first();
    });
  }

  static async addNetwork(input: NetworkInputs['addNetwork']) {
    return db.transaction('rw', db.networks, async () => {
      const count = await db.networks.count();
      const inputToAdd: Required<NetworkData> = {
        id: createUUID(),
        chainId: input.data.chainId,
        name: input.data.name,
        url: input.data.url,
        isSelected: Boolean(count === 0),
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
      const network = await NetworkService.getNetworkById(input);
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
    // Add testnet network by default
    const testnetInfo = await NetworkService.getChainInfo({
      providerUrl: TESTNET_NETWORK_URL,
    }).catch(() => ({ name: 'Fuel Sepolia Testnet' }));
    const testnetNetwork = await NetworkService.addNetwork({
      data: {
        chainId: CHAIN_IDS.fuel.testnet,
        name: testnetInfo.name,
        url: TESTNET_NETWORK_URL,
      },
    });

    // Add testnet network by default
    const devnetInfo = await NetworkService.getChainInfo({
      providerUrl: DEVNET_NETWORK_URL,
    }).catch(() => ({ name: 'Fuel Ignition Sepolia Devnet' }));
    const devnetNetwork = await NetworkService.addNetwork({
      data: {
        chainId: CHAIN_IDS.fuel.devnet,
        name: devnetInfo.name,
        url: DEVNET_NETWORK_URL,
      },
    });

    const envProviderUrl = VITE_FUEL_PROVIDER_URL;
    if (isNetworkDevnet(envProviderUrl)) {
      // if it's devnet start with devnet selected
      await NetworkService.selectNetwork({ id: devnetNetwork.id || '' });
    } else if (isNetworkTestnet(envProviderUrl)) {
      // if it's testnet start with testnet selected
      await NetworkService.selectNetwork({ id: testnetNetwork.id || '' });
    } else if (envProviderUrl) {
      // if it's custom network, add and select it
      const customInfo = await NetworkService.getChainInfo({
        providerUrl: envProviderUrl,
      }).catch(() => ({ name: 'Custom Network' }));
      const customNetwork = await NetworkService.addNetwork({
        data: {
          chainId: 0,
          name: customInfo.name,
          url: envProviderUrl,
        },
      });
      await NetworkService.selectNetwork({ id: customNetwork.id || '' });
    }
  }

  static clearNetworks() {
    return db.transaction('rw', db.networks, async () => {
      return db.networks.clear();
    });
  }

  static async getChainInfo(input: NetworkInputs['getChainInfo']) {
    const provider = await createProvider(input.providerUrl);
    return provider.getChain();
  }

  static async getNodeInfo(input: NetworkInputs['getNodeInfo']) {
    const provider = await createProvider(input.providerUrl);
    return provider.fetchNode();
  }

  static async validateNetworkExists(
    input: NetworkInputs['validateNetworkExists']
  ) {
    const { name, url } = input;
    const network = await NetworkService.getNetworkByNameOrUrl({
      name,
      url,
    });
    if (network) {
      throw new Error('Network with Name or URL already exists');
    }
  }

  static async validateNetworkVersion(
    input: NetworkInputs['validateNetworkVersion']
  ) {
    const { url } = input;
    if (!isValidNetworkUrl(url)) {
      throw new Error('Invalid network URL');
    }
    let nodeInfo: NodeInfo;
    try {
      const provider = await createProvider(url);
      nodeInfo = await provider.fetchNode();
    } catch (_err) {
      throw new Error(
        `Network not compatible with Fuel Wallet. Required version is >=${MIN_NODE_VERSION}`
      );
    }
    if (compare(nodeInfo.nodeVersion, MIN_NODE_VERSION, '<')) {
      throw new Error(
        `Network not compatible with Fuel Wallet. Required version is >=${MIN_NODE_VERSION}`
      );
    }
  }
}
