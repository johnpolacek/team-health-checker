# Building a Free Open Source Team Health Check Web App with React, Next.js, GraphQL

## Part 1

Starting point from [Next.js examples](https://github.com/zeit/next.js/tree/master/examples/with-apollo)

~~~~
npx create-next-app --example with-apollo with-apollo-app
~~~~

First, we set up the data. The example uses [graph.cool](https://graph.cool) so let’s use that to make our own.

Initialize graphcool into an api directory:

~~~~
npm install -g graphcool
init graphcool api
~~~~

Set up the schema in the types.grapql file. Our schema has 2 types, HealthChecks and the HealthCheckResponses for that HealthCheck. Each HealthCheckResponse has 11 individual questions that will get assigned an integer by the person responding to the health check.

~~~~
type HealthCheck @model {
  id: ID! @isUnique
  responses: [HealthCheckResponse!]! @relation(name: "HealthCheckInstance")
}

type HealthCheckResponse @model {
  id: ID! @isUnique
  healthCheck: HealthCheck! @relation(name: "HealthCheckInstance")
  q1: Int!
  q2: Int!
  q3: Int!
  q4: Int!
  q5: Int!
  q6: Int!
  q7: Int!
  q8: Int!
  q9: Int!
  q10: Int!
  q11: Int!
}
~~~~

Then deploy, following the steps to set up or log into a Graphcool account.

~~~~
cd api
graphcool deploy
~~~~

Take note of the Simple API GraphQL Endpoint, we will need that. Open `lib/init-apollo.js` and replace the server uri with the Simple API endpoint we just created when we deployed to graphcool.

This will break all the requests coming from the example app since we are now pointing at the new schema we just created.

Now, let’s get into the React code. Returning to the next.js example, we can see some of the components are already using some GraphQL mutations.

Open `index.js` and replace it with this:

~~~~
import App from '../components/App'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

export default () => (
  <App>
    <h1>Team Health Checker</h1>
    <ApolloConsumer>
      {client => (
        <button onClick={() => {onClickCreate(client)}}>Create New Health Check</button>
      )}
    </ApolloConsumer>
  </App>
)

function onClickCreate(client) {
  client.mutate({
    mutation: gql`
      mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
        createHealthCheck(responses: $responses) {
          id
        }
      }
    `
  }).then(({ data }) => {
    console.log('got data', data);
  })
}
~~~~

This bare bones example calls our GraphQL API and creates a new HealthCheck. When the button is clicked, a new HealthCheck is created and the endpoint returns the id for that HealthCheck.

To see it in action, from the top level of the project directory run the build command:

~~~~
npm run dev
~~~~

To better understand how it all works, check out:

- [How to GraphQL: React + Apollo Tutorial](https://www.howtographql.com/react-apollo/0-introduction/)
- [React Apollo docs](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.mutate)
- [Graphcool docs](https://www.graph.cool/docs/)


## Part 2

Now that we can create a health check, we need to be able to share a url with our team and collect their responses. We can use the health check’s id to create a route.

Returning to the [Next.js examples](https://github.com/zeit/next.js/tree/master/examples/), we can find one for [parameterized routing](https://github.com/zeit/next.js/tree/master/examples/parameterized-routing).

Unfortunately, this will require us to use a custom server to be able to match the route to the id.

First, we’ll need to install a new dependencies in our project.

~~~~
npm i path-match
~~~~

Next, let’s grab the `server.js` from the parameterized routing example and put it in the top level of our project directory. Open the file and do a find/replace to change 'blog' to 'healthcheck' to set up the correct routing.

Likewise, copy the `blog.js` into our pages directory, rename it `healthcheck.js` and find/replace 'blog' to 'healthcheck'.

Then, we need to update the build scripts in our `package.json` for our server configuration.

~~~~
"scripts": {
  "dev": "node server.js",
  "build": "next build",
  "start": "NODE_ENV=production node server.js"
},
~~~~

Let’s take a look at what we have so far.

~~~~
npm run dev
~~~~

Go to `http://localhost:3000/healthcheck/123` and you should see the id from the url parameter output to the browser window.

Next, we need to check that id from the url against the data in Graphcool. To do that, we’ll need to bring in some code from the previous page. Also, we will be doing a Query instead of a mutation, so change the react-apollo import to import that instead of Mutation.

~~~~
import React from 'react'
import App from '../components/App'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export default class extends React.Component {
  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    return <App>
      <ApolloConsumer>
        {client => (
          <h1>My {this.props.id} healthcheck</h1>
        )}
      </ApolloConsumer>
    </App>
  }
}
~~~~

Now let’s add a query to check whether id from the url is a valid HealthCheck id.

~~~~
const HEALTHCHECK_QUERY = gql`query HealthCheck($id: ID!) {
  HealthCheck(id: $id) {
    id
    responses {
      id
    }
  }
}`

export default class extends React.Component {
  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    return <App>
      <Query query={HEALTHCHECK_QUERY} variables={{id: this.props.id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching...</div>
          if (error) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          console.log(data)
          return (
            <h1>Loaded HealthCheck id: {this.props.id}</h1>
          )
        }}
      </Query>
    </App>
  }
}
~~~~


