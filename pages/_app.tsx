import { ApolloProvider } from '@apollo/react-hooks';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import React from 'react';
import Footer from '../src/components/layouts/Footer';
import Header from '../src/components/layouts/Header';
import { UserContextProvider } from '../src/context/user';
import { useApollo } from '../src/utils/apollo';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  // console.log({ pageProps });
  const client = useApollo(pageProps.initialClientState);
  return (
    <div>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <ApolloProvider client={client}>
        <UserContextProvider>
          <NextSeo />
          <Header navigations={[{ link: '/', text: 'Home' }]} />
          <Component {...pageProps} />
          <Footer />
        </UserContextProvider>
      </ApolloProvider>
    </div>
  );
};

export default MyApp;
