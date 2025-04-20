import '@/styles/globals.css';
import '../styles/vertical-timeline.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
} 