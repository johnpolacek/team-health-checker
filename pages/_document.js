import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <html>
        <Head>
          <style jsx global>{`
            body > div {
              text-align: center;
              max-width: 600px;
            }
          `}</style>
        </Head>
        <body>
        	<Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
