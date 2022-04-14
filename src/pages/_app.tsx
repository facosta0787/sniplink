import type { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import '../shared/styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;