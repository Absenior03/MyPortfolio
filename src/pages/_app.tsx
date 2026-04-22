import "@/styles/globals.css";
import "../styles/vertical-timeline.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear stale service workers/caches from previous app setups (e.g., CRA)
    // that can request non-existent legacy bundles like main.js.
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
    }

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
