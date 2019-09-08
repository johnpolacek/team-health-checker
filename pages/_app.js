import App, {Container} from 'next/app'
import React from 'react'
import { ThemeProvider, Styled } from 'theme-ui'
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'
import theme from '../components/Theme'


class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const {Component, pageProps, apolloClient} = this.props
    return <Container>
    	<ThemeProvider theme={theme}>
			<ApolloProvider client={apolloClient}>
				<Styled.root>
	            <Component {...pageProps} />
	          </Styled.root>
			</ApolloProvider>
		</ThemeProvider>
    </Container>
  }
}

export default withApolloClient(MyApp)
