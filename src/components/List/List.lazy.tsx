import { lazy, Suspense } from 'react';

const LazyList = lazy(() => import('./List'));

export default function List() {
  return (
    <Suspense fallback={null}>
      <LazyList />
    </Suspense>
  );
}
