import { lazy, Suspense, ComponentProps } from 'react';

const LazyHomepage = lazy(() => import('./Homepage'));

const Homepage = (props: ComponentProps<typeof LazyHomepage>) => (
  <Suspense fallback={null}>
    <LazyHomepage {...props} />
  </Suspense>
);

export default Homepage;
