import { loadOrReload } from './lazyPage';

describe('loadOrReload', () => {
  beforeEach(() => sessionStorage.clear());

  it('reloads once when a chunk fails to load', async () => {
    const reload = jest.fn();
    const pending = loadOrReload(
      () => Promise.reject(new Error('Failed to fetch')),
      reload
    );
    await Promise.resolve();
    await Promise.resolve();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(pending).toBeInstanceOf(Promise);
  });

  it('throws instead of reloading again after the reload', async () => {
    const reload = jest.fn();
    sessionStorage.setItem('fuel_chunk_reload', '1');
    await expect(
      loadOrReload(() => Promise.reject(new Error('Failed to fetch')), reload)
    ).rejects.toThrow('Failed to fetch');
    expect(reload).not.toHaveBeenCalled();
  });

  it('clears the reload flag after a chunk loads', async () => {
    sessionStorage.setItem('fuel_chunk_reload', '1');
    await expect(loadOrReload(async () => 'page')).resolves.toBe('page');
    expect(sessionStorage.getItem('fuel_chunk_reload')).toBeNull();
  });
});
