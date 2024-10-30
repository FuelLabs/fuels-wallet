import { createProvider, createUUID } from '@fuel-wallet/connections';
import type { NetworkData } from '@fuel-wallet/types';
import { compare } from 'compare-versions';
import { type NodeInfo, Provider, type SelectNetworkArguments } from 'fuels';
import { MIN_NODE_VERSION, VITE_FUEL_PROVIDER_URL } from '~/config';
import { DEFAULT_NETWORKS } from '~/networks';
import { db } from '~/systems/Core/utils/database';

import { isValidNetworkUrl } from '../utils';

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
      id?: string;
      chainId: number;
      name: string;
      url: string;
      explorerUrl?: string;
    };
  };
  validateAddNetwork: {
    url: string;
    chainId: string;
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
  validateNetworkSelect: Pick<NetworkData, 'chainId' | 'url'>;
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
      const inputToAdd: Required<
        Omit<NetworkData, 'explorerUrl' | 'bridgeUrl' | 'faucetUrl'>
      > & {
        explorerUrl?: string;
      } = {
        id: input.data.id || createUUID(),
        chainId: input.data.chainId,
        name: input.data.name,
        url: input.data.url,
        isSelected: Boolean(count === 0),
        explorerUrl: input.data.explorerUrl,
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
    for (const [index, network] of DEFAULT_NETWORKS.entries()) {
      const networkAdded = await NetworkService.addNetwork({
        data: {
          id: index.toString(),
          ...network,
        },
      });
      if (network.isSelected) {
        await NetworkService.selectNetwork({ id: networkAdded.id || '' });
      }
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

  static async validateNetworkSelect(
    input: NetworkInputs['validateNetworkSelect']
  ) {
    const { chainId, url } = input;
    const hasChainId = typeof chainId === 'number';
    const hasUrl = typeof url === 'string';

    const currentNetwork = await NetworkService.getSelectedNetwork();

    // When chainId and provider are provided:
    // 1. If chainId and provider does not exist in our database, validate if the chainId is valid.
    // 2. If chainId and provider does not exist in our database, show popup to create if the chainId match the URL.
    // 2. If chainId exists in our database and is selected, return true.
    // 3. If chainId exists in our database but is not selected, show popup to select.
    if (hasChainId && hasUrl) {
      const networkByChainId = await NetworkService.getNetworkByChainId({
        chainId,
      });
      const networkByUrl = await NetworkService.getNetworkByUrl({
        url,
      });

      if (!networkByChainId || !networkByUrl) {
        const provider = await createProvider(url);
        const providerName = provider.getChain().name;
        const providerChainId = provider.getChainId();

        if (providerChainId !== chainId) {
          throw new Error(
            `The URL you have entered returned a different chain ID (${providerChainId}). Please update the Chain ID to match the URL of the network you are trying to add.`
          );
        }

        await NetworkService.validateNetworkVersion({
          url,
        });

        return {
          isSelected: false,
          popup: 'add',
          network: {
            chainId: providerChainId,
            name: providerName,
            url,
          },
          currentNetwork,
        } as const;
      }

      if (networkByUrl.isSelected) {
        return {
          isSelected: true,
          popup: false,
        } as const;
      }

      return {
        isSelected: false,
        popup: 'select',
        network: networkByUrl,
        currentNetwork,
      } as const;
    }

    // When only chainId is provided:
    // 2. If chainId does not exist and the network is unknown, throw an error.
    // 3. If chainId exists in our database and is selected, return true.
    // 4. If chainId exists in our database but is not selected, show popup to select.
    if (hasChainId) {
      const networkByChainId = await NetworkService.getNetworkByChainId({
        chainId,
      });

      if (!networkByChainId) {
        throw new Error('Unknown network, please create it manually');
      }

      if (networkByChainId.isSelected) {
        return {
          isSelected: true,
          popup: false,
        } as const;
      }

      return {
        isSelected: false,
        popup: 'select',
        network: networkByChainId,
        currentNetwork,
      } as const;
    }

    // When only URL is provided:
    // 1. If URL does not exist in our database, show popup to create the network.
    // 2. If URL exists in our database and is selected, return true and don't open the popup.
    // 3. If URL exists in our database but is not selected, show popup to select.
    if (hasUrl) {
      const networkByUrl = await NetworkService.getNetworkByUrl({
        url,
      });

      if (!networkByUrl) {
        const provider = await createProvider(url);
        const providerName = provider.getChain().name;
        const providerChainId = await provider.getChainId();

        await NetworkService.validateNetworkVersion({
          url,
        });

        return {
          isSelected: false,
          popup: 'add',
          network: {
            chainId: providerChainId,
            name: providerName,
            url,
          },
          currentNetwork,
        } as const;
      }

      if (networkByUrl.isSelected) {
        return {
          isSelected: true,
          popup: false,
        } as const;
      }

      return {
        isSelected: false,
        popup: 'select',
        network: networkByUrl,
        currentNetwork,
      } as const;
    }

    throw new Error('Invalid network input, either chainId or url is required');
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
