import { type ComponentType, Suspense, lazy } from 'react';

const RELOAD_KEY = 'fuel_chunk_reload';

// A new deploy or extension update removes the chunks of the old build, so a
// page that is still open fails to load them. Reload once to get the new build.
export function loadOrReload<T>(
  load: () => Promise<T>,
  reload = () => window.location.reload()
): Promise<T> {
  return load().then(
    (result) => {
      sessionStorage.removeItem(RELOAD_KEY);
      return result;
    },
    (error) => {
      if (sessionStorage.getItem(RELOAD_KEY)) throw error;
      sessionStorage.setItem(RELOAD_KEY, '1');
      reload();
      return new Promise<never>(() => {});
    }
  );
}

export function lazyPage(load: () => Promise<ComponentType>) {
  const Page = lazy(() =>
    loadOrReload(load).then((Component) => ({ default: Component }))
  );
  return function LazyPage() {
    return (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    );
  };
}
