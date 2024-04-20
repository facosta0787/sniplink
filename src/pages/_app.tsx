import type { AppProps } from 'next/app';
import App from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Envlabel } from 'src/components/Envlabel';
import { config } from '../../config/env';
import '../shared/styles/globals.css';

const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  host: string;
  linkDomain: string;
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps, host, linkDomain } = props;
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} linkDomain={linkDomain} />
      <Envlabel host={host} />
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const { req } = appContext.ctx;
  const appProps = await App.getInitialProps(appContext);
  return {
    ...appProps,
    host: req?.headers.host,
    linkDomain: config.LINK_DOMAIN,
  };
};

export default MyApp;
