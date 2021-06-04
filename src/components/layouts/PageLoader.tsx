import nprogress from 'nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// This component provides a minimal progress indicator at the header of the page
// when navigating between pages.
const PageLoader = () => {
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let timeout: NodeJS.Timeout;

    function start() {
      clearTimeout(timeout);
      timeout = setTimeout(() => nprogress.start(), 100);
    }

    function done() {
      clearTimeout(timeout);
      nprogress.done();
    }

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', done);
    router.events.on('routeChangeError', done);
    return () => {
      done();
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', done);
      router.events.off('routeChangeError', done);
    };
  }, []);

  return null;
};

export default PageLoader;
