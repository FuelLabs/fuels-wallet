import { type ComponentType, Suspense, lazy } from 'react';

export function lazyPage(load: () => Promise<ComponentType>) {
  const Page = lazy(() => load().then((Component) => ({ default: Component })));
  return function LazyPage() {
    return (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    );
  };
}
