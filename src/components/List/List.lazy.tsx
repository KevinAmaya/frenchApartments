import { lazy, Suspense, ComponentProps } from 'react';

const LazyList = lazy(() => import('./List'));

const List = (props: ComponentProps<typeof LazyList>) => (
  <Suspense fallback={null}>
    <LazyList {...props} />
  </Suspense>
);

export default List;
