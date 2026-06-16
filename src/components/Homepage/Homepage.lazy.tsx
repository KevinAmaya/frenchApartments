import { lazy, Suspense } from 'react';

const LazyHomepage = lazy(() => import('./Homepage'));

export default function Homepage() {
  return (
    <Suspense fallback={null}>
      <LazyHomepage />
    </Suspense>
  );
}
