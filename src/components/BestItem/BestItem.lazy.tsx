import { lazy, Suspense, ComponentProps } from 'react';

const LazyBestItem = lazy(() => import('./BestItem'));

const BestItem = (props: ComponentProps<typeof LazyBestItem>) => (
  <Suspense fallback={null}>
    <LazyBestItem {...props} />
  </Suspense>
);

export default BestItem;
