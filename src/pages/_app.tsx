import type { AppProps } from 'next/app';
import App from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Envlabel } from 'src/components/Envlabel';
import { config } from '../../config/env';
import '../shared/styles/globals.css';

const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  host: string;
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps, host } = props;
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Envlabel host={host} />
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const { req } = appContext.ctx;
  const appProps = await App.getInitialProps(appContext);
  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      linkDomain: config.LINK_DOMAIN,
    },
    host: req?.headers.host,
  };
};

export default MyApp;
