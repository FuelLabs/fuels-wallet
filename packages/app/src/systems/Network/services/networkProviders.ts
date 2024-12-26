import { Provider } from 'fuels';
import { NetworkService } from './network';

export class NetworkProviders {
  providers: Record<string, Promise<Provider>> = {};
  constructor() {
    this.populateProviders();
  }

  async populateProviders() {
    const networks = await NetworkService.getNetworks();
    for (const network of networks) {
      try {
        this.providers[network.url] = Provider.create(network.url);
      } catch (error) {
        console.error('Error creating provider', network.url, error);
      }
    }
  }
}

export const networkProviders = new NetworkProviders();
