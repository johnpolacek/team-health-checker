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

*api/types.grapql*
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

*pages/index.js*
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

*pages/healthcheck.js*

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

Now let’s add a query to check whether id from the url is a valid HealthCheck id. This time, rather than calleing the query method on the `ApolloClient` directly, we will use Apollo’s [render prop API](https://blog.apollographql.com/introducing-react-apollo-2-1-c837cc23d926) to manage the data with a Query component.

*pages/healthcheck.js*

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
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          return (
            <h1>Loaded HealthCheck id: {this.props.id}</h1>
          )
        }}
      </Query>
    </App>
  }
}
~~~~

As you can see, we define a query for the HealthCheck, and then in our Query component we handle the loading, error and success states.

To get this working, we can update our create health check page to give us a link to the generated health check.

Rather than putting more logic into the page, now is a good time to create a component that to handle the generation of a new health check.

We are going to use React Hooks in this component, so we will need to install the latest version of React in our project (and might as well update the other dependencies while we are at it).

*components/HealthCheckCreator.js*

~~~~
import { useState } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'

const CREATEHEALTHCHECK_MUTATION = gql`
  mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
    createHealthCheck(responses: $responses) {
      id
    }
  }
`

const HealthCheckCreator = () => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {
        id ? (
          <>
            <p>You created a new Health Check!</p>
            <Link href={'/healthcheck/'+id}>
              <a>View health check</a>
            </Link>
          </>
        ) : (
          <Mutation 
            mutation={CREATEHEALTHCHECK_MUTATION} 
            onCompleted={(data) => {setId(data.createHealthCheck.id)}}
          >
            {createMutation => <button 
                onClick={() => {
                  setLoading(true)
                  createMutation()
                }}
                children = {loading ? 'Loading...' : 'Create New Health Check'}
              />
            }
          </Mutation>
        )
      }
    </>
  )
}

export default HealthCheckCreator
~~~~

Let’s go over what we are doing.

As you can see, we are using React Hooks to manage the state for before/after an id is generated for a new health check, as well as the in-between loading state.

We have switched to using a Mutation component rather than working directly with the Apollo client, but the GraphQL statement is the same and is passed to the Mutation component as a prop.

Additionally, we have an onCompleted handler that will use our Hook to set the id to the one that comes from the Graphcool response data.

Within the Mutation component, we have our button which has a new onClick function that initiates the mutation and sets loading to true.

After the id is set, we display the success message and a link to view the health check. We use the Next.js `Link` component to handle our client-side routing.

Now we can use our HealthCheckCreator component and clean up `index.js` a bit.

*index.js*

~~~~
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'

export default () => (
  <App>
    <h1>Team Health Checker</h1>
    <HealthCheckCreator />
  </App>
)
~~~~

Test it out and you after you click on the link, you should land on the health check page with the message indicating the load for that id was successful.

To see the failure state, go to `http://localhost:3000/healthcheck/123` and there should be an error message that the health check with id 123 could not be found.

##Part 3

For the next part of developing this app, we will allow people to fill in the health check responses.

We won’t worry about styling or a great user experience just yet, as this is just an exploratory proof-of-concept at this point.

Let’s add a begin health check button, then display some UI that allows people to provide responses to each of the questions.

*pages/healthcheck.js*

~~~~
<h1>Loaded HealthCheck id: {this.props.id}</h1>
<button>Begin health check</button>
<HealthCheckTopic 
  title="Topic 1"
  onNext={(rating) => { 
    console.log('onNext rating '+rating) 
  }} 
/>
~~~~

*components/HealthCheckTopic.js*

~~~~
import PropTypes from 'prop-types'
import { useState } from 'react'

const HealthCheckTopic = (props) => {

  const [rating, setRating] = useState(null);

  const onChange = e => {
    setRating(e.target.value)
  }

  return (
    <div>
      <h2>{props.title}</h2>
      <div>
        <input onChange={onChange} type="radio" id="awesome" name="rating" value="2" />
        <label htmlFor="awesome">Awesome</label>
      </div>
      <div>
        <input onChange={onChange} type="radio" id="ok" name="rating" value="1" />
        <label htmlFor="ok">OK</label>
      </div>
      <div>
        <input onChange={onChange} type="radio" id="sucky" name="rating" value="0" />
        <label htmlFor="sucky">Sucky</label>
      </div>
      <button disabled={rating == null} onClick={() => {props.onNext(rating)}}>Next</button>
    </div>
  )
}

HealthCheckTopic.propTypes = {
    title: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired
}

export default HealthCheckTopic
~~~~

As a starting point, we have a click to begin button that does nothing, and a HealthCheckTopic that takes some props, include an `onNext` function that will provide the rating that the user selects.

Next, we will add the steps to advance through the health check. In a separate file, we can define some data with the topics from the Spotify Health Check.




TO DO NEXT:
Make HealthCheckTopics that contains the HealthCheckTopic component and does the steps.









