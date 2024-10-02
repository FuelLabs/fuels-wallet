import { VAULT_SCRIPT_NAME } from '@fuel-wallet/types';
import { MessageTypes, type RequestMessage } from '@fuels/connectors';
import { EXPLORER_URL, VITE_CRX_VERSION_API } from '~/config';

import { createUUID } from '@fuel-wallet/connections';
import { CHAIN_IDS } from 'fuels';
import { db } from '../../../../systems/Core/utils/database';
import type { CommunicationProtocol } from './CommunicationProtocol';

export class NetworkChangeService {
  readonly communicationProtocol: CommunicationProtocol;

  private networkChangeTimeout: NodeJS.Timeout | null = null;
  private abortNetworkChange = false;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.handleRequest = this.handleRequest.bind(this);
    this.communicationProtocol = communicationProtocol;
    this.setupListeners();
    this.watchForNetworkChanges();
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new NetworkChangeService(communicationProtocol);
  }

  async watchForNetworkChanges() {
    this.networkChangeTimeout && clearTimeout(this.networkChangeTimeout);
    this.networkChangeTimeout = setTimeout(async () => {
      if (
        this.abortNetworkChange ||
        (await this.checkForRemoteIngnitionNetwork())
      )
        return;
      this.watchForNetworkChanges();
    }, 1000);
  }

  handleRequest(message: RequestMessage) {
    if (message.target !== VAULT_SCRIPT_NAME) {
      return;
    }
    if (message.request.method === 'unlock') {
      this.abortNetworkChange = true;
      this.networkChangeTimeout && clearTimeout(this.networkChangeTimeout);
      return;
    }
    if (message.request.method === 'lock') {
      this.abortNetworkChange = false;
      this.watchForNetworkChanges();
    }
  }

  private setupListeners() {
    this.communicationProtocol.on(MessageTypes.request, this.handleRequest);
  }

  async checkForRemoteIngnitionNetwork() {
    console.log('fsk checking for remote');
    const releaseJson = await fetch(VITE_CRX_VERSION_API)
      .then((res) => res.json())
      .catch(() => ({}));
    const mainnetUrl = releaseJson?.networks?.mainnet;
    if (!mainnetUrl || typeof mainnetUrl !== 'string') {
      return false;
    }
    await db.transaction('rw', db.networks, async () => {
      const ignitionNetwork = await db.networks
        .where('name')
        .equalsIgnoreCase('Ignition')
        .first();

      if (ignitionNetwork?.id) {
        await db.networks.update(ignitionNetwork.id, {
          url: mainnetUrl,
          isSelected: true,
        });
        return;
      }
      await db.networks.add({
        id: createUUID(),
        chainId: CHAIN_IDS.fuel.mainnet,
        name: 'Ignition',
        url: mainnetUrl,
        explorerUrl: EXPLORER_URL,
        isSelected: true,
      });

      //Make sure all other networks have `isSelected` set to false
      await db.networks
        .where('name')
        .notEqual('Ignition')
        .modify({ isSelected: false });
    });
    return true;
  }

  stop() {
    this.communicationProtocol.removeListener(
      MessageTypes.request,
      this.handleRequest
    );
  }
}
