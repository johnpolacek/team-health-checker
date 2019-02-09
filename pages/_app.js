import App, {Container} from 'next/app'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import theme from './_theme'
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'

class MyApp extends App {
  render () {
    const {Component, pageProps, apolloClient} = this.props
    return <Container>
    	<ThemeProvider theme={theme}>
	      <ApolloProvider client={apolloClient}>
	        <Component {...pageProps} />
	      </ApolloProvider>
	    </ThemeProvider>
    </Container>
  }
}

export default withApolloClient(MyApp)
