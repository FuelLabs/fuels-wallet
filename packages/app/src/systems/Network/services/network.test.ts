/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { MOCK_NETWORKS } from '../__mocks__/networks';

import { NetworkService } from './network';

const NETWORK = MOCK_NETWORKS[0];

describe('NetworkService', () => {
  beforeEach(async () => {
    await NetworkService.clearNetworks();
  });

  it('should be able to add a new network', async () => {
    const networks = await NetworkService.getNetworks();
    expect(networks.length).toBe(0);

    await NetworkService.addNetwork({ data: NETWORK });
    const result = await NetworkService.getNetworks();
    expect(result.length).toBe(1);
  });

  it('should be able to remove a new network', async () => {
    await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
    const network = await NetworkService.addNetwork({ data: MOCK_NETWORKS[1] });
    await NetworkService.removeNetwork({ id: network?.id! });
    const result = await NetworkService.getNetworks();
    expect(result.length).toBe(1);
  });

  it('should be able to update a new network', async () => {
    const network = await NetworkService.addNetwork({ data: NETWORK });
    const id = network?.id!;
    await NetworkService.updateNetwork({ id, data: { name: 'Network Test' } });
    const result = await NetworkService.getNetwork({ id });
    expect(result?.name).toBe('Network Test');
  });

  it('should be able to retrieve a new network', async () => {
    const network = await NetworkService.addNetwork({ data: NETWORK });
    const result = await NetworkService.getNetwork({ id: network?.id! });
    expect(result?.name).toBe(NETWORK.name);
  });

  // ---------------------------------------------------------------------------
  // Custom use cases
  // ---------------------------------------------------------------------------

  it('should mark selected when add the first network', async () => {
    const network = await NetworkService.addNetwork({ data: NETWORK });
    expect(network?.isSelected).toBe(true);
  });

  it('should deselect current network when select a new one', async () => {
    const network1 = await NetworkService.addNetwork({ data: NETWORK });
    const network2 = await NetworkService.addNetwork({
      data: MOCK_NETWORKS[1],
    });
    await NetworkService.selectNetwork({ id: network2?.id! });

    const res = await NetworkService.getNetwork({ id: network1?.id! });
    expect(res?.isSelected).toBe(false);
  });

  it('should not be able to add two networks with the same name', async () => {
    try {
      await NetworkService.addNetwork({ data: { name: 'test', url: 'test1' } });
      await NetworkService.addNetwork({ data: { name: 'test', url: 'test2' } });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should not be able to add two networks with the same url', async () => {
    try {
      await NetworkService.addNetwork({ data: { name: 'test1', url: 'test' } });
      await NetworkService.addNetwork({ data: { name: 'test2', url: 'test' } });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
