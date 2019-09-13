# Building and Deploying a SSR Web App
###### with React, Apollo, Next.js, Now, Theme UI and Cypress

----
<br/>

## Part 1

### What are we building?

#### Team Health Check
The purpose of a Team Health Check is is to facillitate round table discussion that can improve different aspects of your team. We are going to model ours after the [Spotify Squad Health Check](https://labs.spotify.com/2014/09/16/squad-health-check-model/). For an example of this in practice, check out this [episode of the Rabbit Hole Podcast](https://www.stridenyc.com/podcasts/96-health-check

Most examples of health checks are analog, done with cards and everyone gathered together in the same room. This is great for in-office, but what about for our increasingly remote teams? 

Our goal is to create an online version of this, that can be done in during a team video chat.

### SSR Web Apps 

The ability to build isomorphic (~aka universal) web apps is that the same React and JS code can run on the client and the server. 

The benefit here is that you can get a fast page load on that first visit, where, just like on a traditional server-side web architecture, the server sends just what is needed to the client, the initial minified render of the page, inlining critical styles and the app bundle. From there the client takes over, providing the faster rendering experience you can get from a single-page app when navigating between views.

#### Next.js

With [Next.js](https://nextjs.org/), for each route in the app, we load the necessary data for its inital component tree and render the page server-side to send to the browser, and then our client-side React app will get its initial state and handle the rest from there.

### Apollo and GraphQL

To get started, we can create a new Next app from the [Next.js with-apollo example](https://github.com/zeit/next.js/tree/master/examples/with-apollo).

~~~~
npx create-next-app --example with-apollo with-apollo-app
~~~~

First, let’s set up our data. Our Next.js example uses [graph.cool](https://graph.cool) so let’s use that to make our own.

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
  ratings: [Int!]!
}
~~~~

Then deploy, following the steps to set up or log into a Graphcool account.

~~~~
cd api
graphcool deploy
~~~~

Take note of the Simple API GraphQL Endpoint, we will need that. Open `lib/init-apollo.js` and replace the server uri with the Simple API endpoint we just created when we deployed to graphcool.

This will break all the requests coming from the example app since we are now pointing at the new schema we just created.

One key thing at work in the example is that our App component is actually wrapped in a [higher-order component (HOC)](https://reactjs.org/docs/higher-order-components.html).

> Using the HOC pattern we’re able to pass down a central store of query result data created by Apollo into our React component hierarchy defined inside each page of our Next application. - read more at [The idea behind the example](https://github.com/zeit/next.js/tree/master/examples/with-apollo)

*pages/_app.js*

~~~~
import App, {Container} from 'next/app'
import React from 'react'
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'

class MyApp extends App {
  render () {
    const {Component, pageProps, apolloClient} = this.props
    return <Container>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Container>
  }
}

export default withApolloClient(MyApp)
~~~~

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
    <div>
      <p>Health checks help you find out how your team is doing, and work together to improve.</p>
      <p>This health check is based on <a href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
    </div>
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

[Now](https://zeit.co/now) is a serverless deployment service from [Zeit](https://zeit.co), the makers of Next.js. We will be using Now 2.0 to configure our routes - see their [Guide to Custom Serverless Next.js Routing](https://zeit.co/guides/custom-next-js-server-to-routes/).

Define a new route at `/check/:id` in a now.json config file, and specify that our build step will use `@now/next`.

*now.json*

~~~~
{
  "version": 2,
  "routes": [
    { "src": "/check/(?<id>[^/]+)$", "dest": "/check?id=$id" }
  ],
  "builds": [{ "src": "package.json", "use": "@now/next" }]
}
~~~~

Let’s set up a basic page to test our route.

*pages/check.js*

~~~~
import App from '../components/App'

const HealthCheck = ({ id }) => (
  <App>
    <h1>Loaded HealthCheck id: {id}</h1>
  </App>
)
HealthCheck.getInitialProps = async ({ query }) => {
  return { id: query.id }
}
export default HealthCheck
~~~~

Then, we will update `package.json` with a new build command for now.

*package.json*

~~~~
"scripts": {
  "dev": "next",
  "build": "next build",
  "now-build": "next build"
},
~~~~

Let’s see what we have so far.

~~~~
now dev
~~~~

Go to `http://localhost:3000/check/123` and you should see the id from the url parameter output to the browser window.

Next, we need to check that id from the url against the data in Graphcool. 

To do that, we’ll need to bring in some code from the previous page. Also, we will be doing a Query instead of a mutation.

The query will check whether id from the url is a valid HealthCheck id. This time, rather than calling the query method on the `ApolloClient` directly, we will use Apollo’s [render prop API](https://blog.apollographql.com/introducing-react-apollo-2-1-c837cc23d926) to manage the data with a Query component.

Rather than defining our GraphQL operations inside components, we can instead store these in their own module.

*api/operations.js*

~~~~
import gql from 'graphql-tag';

export const getHealthCheckQuery = gql`
  query HealthCheck($id: ID!) {
    HealthCheck(id: $id) {
      id
      responses {
        id
        ratings
      }
    }
  }
`
~~~~

*pages/check.js*

~~~~
import React from 'react'
import App from '../components/App'
import getHealthCheckQuery from '../api/operations'
import { Query } from 'react-apollo'

const HealthCheck = ({ id }) => (
  <App>
      <Query query={getHealthCheckQuery} variables={{id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          return (
            <h1>Loaded HealthCheck id: {id}</h1>
          )
        }}
      </Query>
    </App>
)
HealthCheck.getInitialProps = async ({ query }) => {
  return { id: query.id }
}
export default HealthCheck
~~~~

As you can see, we define a query for the HealthCheck, and then in our Query component we handle the loading, error and success states.

To get this working, we can update our create health check page to give us a link to the generated health check.

Rather than putting more logic into the page, now is a good time to create a component that to handle the generation of a new health check.

We are going to use React Hooks in this component, so we will need to install the latest version of React in our project (and might as well update the other dependencies while we are at it).

*api/operations.js*

~~~~
...
export const createHealthCheckMutation = gql`
  mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
    createHealthCheck(responses: $responses) {
      id
    }
  }
`
~~~~

*components/HealthCheckCreator.js*

~~~~
import { useState } from 'react';
import { Mutation } from 'react-apollo'
import { createHealthCheckMutation } from '../api/operations'
import Link from 'next/link'

const HealthCheckCreator = (props) => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {
        id ? (
          <>
            <h2>You created a new Health Check!</h2>
            <div>
              <p>You can share it with your friends by sharing this link:</p>
              <input readonly type="text" value={window.location.href+'/check/'+id} /> 
            </div>
            <p>
              <Link prefetch href={'/check/'+id}>
                <a>View health check</a>
              </Link>
            </p>
          </>
        ) : (
          <Mutation 
            mutation={createHealthCheckMutation} 
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

As you can see, we are using React Hooks to manage the state for before/after an id is generated for a new health check, as well as the in-between loading state.

We have switched to using a Mutation component rather than working directly with the Apollo client, but the GraphQL statement is the same and is passed to the Mutation component as a prop.

Additionally, we have an onCompleted handler that will use our Hook to set the id to the one that comes from the Graphcool response data.

Within the Mutation component, we have our button which has a new onClick function that initiates the mutation and sets loading to true.

After the id is set, we display the success message and a link to view the health check. We use the Next.js `Link` component to handle our client-side routing.

Now we can use our HealthCheckCreator component and clean up `index.js` a bit.

*index.js*

~~~~
import Head from 'next/head'
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'

export default () => (
  <App>
    <Head>
      <title>Team Health Checker</title>
    </Head>
    <h1>Team Health Checker</h1>
    <div>
      <p>Health checks help you find out how your team is doing, and work together to improve.</p>
      <p>This health check is based on <a href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
    </div>
    <HealthCheckCreator />
  </App>
)
~~~~

Test it out and you after you click on the link, you should land on the health check page with the message indicating the load for that id was successful.

To see the failure state, go to `http://localhost:3000/check/123` and there should be an error message that the health check with id 123 could not be found.

##Part 3

For the next part of developing this app, we will allow people to fill in the health check responses.

We won’t worry about styling or a great user experience just yet, as this is just an exploratory proof-of-concept at this point.

First, let’s define topic data for our health check api (our health check is based on [Spotify’s Squad Health Check](https://labs.spotify.com/2014/09/16/squad-health-check-model/) and the labels for the three possible ratings. 

*api/operations.js*

~~~~
...
export const topics = [
  {
    title:'Easy to release',
    pos:'Releasing is simple, safe, painless and mostly automated.',
    neg:'Releasing is risky, painful, lots of manual work and takes forever.'
  },
  {
    title:'Suitable Process',
    pos:'Our way of working fits us perfectly!',
    neg:'Our way of working sucks!'
  },
  {
    title:'Health of Codebase',
    ...
...
~~~~

Let’s add a component that allows people to provide responses to each of the topics.

*pages/check.js*

~~~~
...
<h1>Loaded HealthCheck id: {this.props.id}</h1>
<HealthCheck onComplete={() => {console.log('complete!')}} />
...
~~~~

*components/HealthCheck.js*

~~~~
import PropTypes from 'prop-types'
import { useState } from 'react'
import { topics, ratingLabels } from '../api/operations'

const HealthCheck = (props) => {

  const [currRating, setCurrRating] = useState(null)
  const [ratings, setRatings] = useState([])
  
  const currTopic = ratings.length

  const onChange = e => {
    setCurrRating(parseInt(e.target.value))
  }

  const onConfirmRating = () => {
    const newRatings = ratings.concat([currRating])
    if (newRatings.length === topics.length) {
      props.onComplete(newRatings)
    } else {
      setRatings(newRatings)
      setCurrRating(null)
    }  
  }

  return (
    <>
      <h2>{topics[currTopic].title}</h2>
      <div onChange={onChange}>
        <div>
          <input checked={currRating === 2}  type="radio" id="awesome" name="rating" value="2" />
          <label htmlFor="awesome">Awesome</label>
        </div>
        <div>
          <input checked={currRating === 1} type="radio" id="ok" name="rating" value="1" />
          <label htmlFor="ok">OK</label>
        </div>
        <div>
          <input checked={currRating === 0} type="radio" id="sucky" name="rating" value="0" />
          <label htmlFor="sucky">Sucky</label>
        </div>
      </div>
      <button 
        disabled={currRating == null} 
        onClick={onConfirmRating}
        children="Next"
      />
    </>
  )
}

HealthCheck.propTypes = {
  onComplete: PropTypes.func.isRequired
}

export default HealthCheck
~~~~

Our HealthCheck component contains an array of topic titles, and an array of ratings responses. 

For each topic, the user will click a button which will add the rating to the array of ratings responses and go to the next topic. When they have provided ratings for all the topics, an `onComplete` function prop will be called.

Next, we need to build in some views depending on where the user is in the health check process. Let’s add a button for the user to click to start the health check, and a results view for when the health check is complete.

*pages/check.js*

~~~~
export default class extends React.Component {

  constructor(props) {
    super(props)

    this.views = {
      READY: 'READY',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETE: 'COMPLETE'
    }

    this.state = {
      view: this.views.READY
    }
  }

  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    
    return <App>
      <Query query={getHealthCheckQuery} variables={{id: this.props.id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          return (
            <>
              {{
                READY: <>
                  <button onClick={() => this.setState({view: this.views.IN_PROGRESS})}>Begin health check</button>
                </>,
                IN_PROGRESS: <HealthCheck onComplete={() => {
                  console.log('COMPLETE!')
                  this.setState({view: this.views.COMPLETE})}} 
                />,
                COMPLETE: <p>Thanks for completing the health check!</p>
              }[this.state.view]}
            </>
          )
        }}
      </Query>
    </App>
  }
}
~~~~

To manage the state of which view is active, we use a views object as an enum and then within our render we have an inline object that renders a given view based on the current view state. 


##Part 4

In the last part, we created a component for a user to enter their responses to a health check, but we didn’t do anything with them. Now we need to store their answers in our GraphQL database and display them. 

To achieve this, as we did when creating a new health check, we will be creating a mutation, in this case a nested create mutation (see the [Graphcool docs](https://www.graph.cool/docs/reference/graphql-api/mutation-api-ol0yuoz6go#nested-create-mutations)), to add the health check response and link it to the id of the health check.

*api/operations.js*

~~~~
...
export const createHealthCheckResponseMutation = gql`
  mutation createHealthCheckResponse($ratings: [Int!]!, $healthCheckId: ID!) {
    createHealthCheckResponse(ratings: $ratings, healthCheckId: $healthCheckId) {
      id
    }
  }
`
~~~~

Update the health check component with a confirm step to send the completed response to the database.

*components/HealthCheck.js*

~~~~
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topics } from '../api/operations'

const HealthCheck = (props) => {

  const [currRating, setCurrRating] = useState(null)
  const [ratings, setRatings] = useState([])
  const [isDone, setIsDone] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const currTopic = ratings.length

  const onChange = e => {
    setCurrRating(parseInt(e.target.value))
  }

  const onConfirmRating = () => {
    setRatings(ratings.concat([currRating]))
    setCurrRating(null)
  }

  return (
    <>
      {
        ratings.length === topics.length ? (
          <Mutation
            mutation={createHealthCheckResponseMutation} 
            variables={{ ratings, healthCheckId: props.id }}
            onCompleted={props.onComplete}
            refetchQueries={() => {
              return [{
                query: getHealthCheckQuery,
                variables: { id: props.id }
              }]
            }}
            awaitRefetchQueries={true}
          >
            {
              createMutation => {
                return (
                  <>
                    {
                      ratings.map((rating, i) => {
                        return (<div key={topics[i].title}>{topics[i].title}: {ratingLabels[rating]}</div>)
                      })
                    }
                    <button 
                      onClick={() => {
                        setLoading(true)
                        createMutation()
                      }}
                      children = {loading ? 'Saving...' : 'Confirm'}
                    />
                  </>
                )
              }
            }
          </Mutation>
        ) : (
          <>
            <h2>{topics[currTopic].title}</h2>
            <div onChange={onChange}>
              <div>
                <input onChange={() => {}} checked={currRating === 2}  type="radio" id={ratingLabels[2]} name="rating" value="2" />
                <label htmlFor={ratingLabels[2]}>{ratingLabels[2]}</label>
              </div>
              <div>
                <input onChange={() => {}} checked={currRating === 1} type="radio" id={ratingLabels[1]} name="rating" value="1" />
                <label htmlFor={ratingLabels[1]}>{ratingLabels[1]}</label>
              </div>
              <div>
                <input onChange={() => {}} checked={currRating === 0} type="radio" id={ratingLabels[0]} name="rating" value="0" />
                <label htmlFor={ratingLabels[0]}>{ratingLabels[0]}</label>
              </div>
            </div>
            <button 
              disabled={currRating == null} 
              onClick={onConfirmRating}
              children="Next"
            />
          </>
        )
      }
    </>
  )
}

HealthCheck.propTypes = {
  id: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired
}

export default HealthCheck
~~~~

Now, for the HealthCheckComplete component, we will show a success message and a link to view the results for all of the team’s responses.

*components/HealthCheckComplete.js*

~~~~
import Link from 'next/link'

export default (props) => {
  return (
  	<div>
	    <p>Thanks for taking health check {props.id}!</p>
	    <Link prefetch href={'/results/'+props.id}>
	      <a href={'/check/'+props.id}>View results</a>
	    </Link>
		</div>
  )
}
~~~~

Next, we need a way to review all the health check responses and see the results of all the completed health checks. We will make a HealthCheckResults component and again use a Query to pull the data from GraphQL.

Rather than defining our queries and mutations within the various components, it makes sense to bring them all together in one file and import them in as needed. While we’re at it, let’s put our `topics` data in there as well since we’ll want to share that across our app.

To display the results, we can iterate through the responses and increment the values (Awesome/OK/Sucky) for each topic.

*components/HealthCheckResults.js*

~~~~
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { getHealthCheckQuery, topics } from '../api/operations'

const HealthCheckResults = (props) => {

  return (
    <Query query={getHealthCheckQuery} variables={{id: props.id}}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>
        if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>

        let topicRatings = topics.map(() => { return [0,0,0] })
        const responses = data.HealthCheck.responses.forEach((response) => {
     			response.ratings.forEach((rating, topicIndex) => {
            topicRatings[topicIndex][rating]++
     			})
        })

        return (
          <>
          	<p>Here are the results:</p>
          	{
          		topicRatings.map((topic, topicIndex) => 
          			<div key={'topicRating'+topicIndex}>
          				<h3>{topics[topicIndex].title}</h3>
          				<p>Awesome: {topic[2]}</p>
          				<p>OK: {topic[1]}</p>
          				<p>Sucky: {topic[0]}</p>
          				<p>Average: {topic[1] + (topic[2] * 2)/data.HealthCheck.responses.length}</p>
          			</div>
          		)
          	}
          </>
        )
      }}
    </Query>
  )
}

HealthCheckResults.propTypes = {
  id: PropTypes.string.isRequired
}

export default HealthCheckResults
~~~~

We also will need to add a new page and route.

*pages/results.js*

~~~~
import React from 'react'
import App from '../components/App'
import HealthCheckResults from '../components/HealthCheckResults'
import { Query } from 'react-apollo'
import { getHealthCheckQuery } from '../api/operations.js'

const Results = ({ id }) => (
  <App>
    <Query query={getHealthCheckQuery} variables={{id: id}}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>
          } else if (error || !data.HealthCheck) {
            return <div>Error: Could not load HealthCheck with id: {id}</div>
          } else {
            return <HealthCheckResults id={id} />
          }
        }}
      </Query>
  </App>
)

Results.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Results
~~~~

*now.json*

~~~~
{
  "version": 2,
  "routes": [
    { "src": "/check/(?<id>[^/]+)$", "dest": "/check?id=$id" },
    { "src": "/results/(?<id>[^/]+)$", "dest": "/results?id=$id" }
  ],
  "builds": [{ "src": "package.json", "use": "@now/next" }]
}
~~~~

A key aspect of our GraphQL api is that the getHealthCheckQuery is cached, so when the onComplete event in our HealthCheck component fires, we need to tell it to refetch that query.

*components/HealthCheck.js*

~~~~
...
<Mutation
  mutation={createHealthCheckResponseMutation} 
  variables={{ ratings, healthCheckId: props.id }}
  onCompleted={props.onComplete}
  refetchQueries={() => {
    return [{
      query: getHealthCheckQuery,
      variables: { id: props.id }
    }]
  }}
  awaitRefetchQueries={true}
>  
...
~~~~

##Part 5


Now that we have a basic working proof-of-concept, it is time to improve the design.

You don’t need to use CSS-in-JS to build React Apps, but styles are often closely tied to state at the component layer. For that and [other reasons](https://jxnblk.com/blog/why-you-should-learn-css-in-js/), it is quite popular. Let’s do it!

First off, let’s set up some theming configuration for colors, typography and spacing. To do this, we will use [Theme UI](https://theme-ui.com/), a library for building designs with a constraint-based design system (a theme!). 

For more information on Theme UI, check out the [documentation](https://theme-ui.com/getting-started) which has more detail about the steps below.

~~~~
$ npm i theme-ui @emotion/core @mdx-js/react
~~~~

First, we will define the color, typographic and layout scale properties in a `Theme.js` file.

*components/Theme.js*

~~~~
export default {
  fonts: {
    body: `'avenir next', avenir, helvetica, arial, sans-serif`,
  },
  fontSizes: [12,14,16,20,24,32,48,64,72,96],
  fontWeights: {
    lite: 200,
    body: 400,
    heading: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    base: "#4169e1",
    black: "#000",
    blue: "#4169e1",
    cyan: "#41b9e1",
    gray: "#aeb3c0",
    green: "#41e169",
    purple: "#6941e1",
    orange: "#fba100",
    pink: "#e141b9",
    red: "#ee5555",
    white: "#fff",
    yellow: "#FFDD22",
  },
  space: [0,4,8,16,32,64,128],
  breakpoints: ['32em','48em','64em','80em'],
  radii: [4]
}
~~~~

To get Theme UI to work with Next.js, there is some additional configuration we need to do. We will take what we have now and applying updates from the [Next.js Theme UI Example](https://github.com/system-ui/theme-ui/tree/master/examples/next).

To give our pages and components access to this theme file, we will use Theme UI’s `ThemeProvider` in our `App` component.

*pages/_app.js*

~~~~
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
~~~~

To avoid a flash or unstyled content, we use the [Document component](https://nextjs.org/docs/#custom-document) component from Next.js. We can also use Emotion’s `Global` combined with our `Theme` props to apply base styling across all the pages of our app.

*pages/_document.js*

~~~~
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Global, css } from '@emotion/core'
import theme from '../components/Theme'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <body>
          <Global
            styles={css`
              button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.2;-webkit-text-size-adjust:100%}body{margin:0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}
              html{box-sizing:border-box;} *,*:before,*:after{box-sizing:inherit;} 
              body{margin:0;font-family:${theme.fonts.body};font-size:${theme.fontSizes[1]}px;} 
              button,input[type=submit]{cursor:pointer;background:${theme.colors.primary};color:white;padding:${theme.space[3]}px ${theme.space[4]}px;border-radius:${theme.radii[0]}px;border:none;font-size:${theme.fontSizes[]}px;}
              p{line-height:${theme.lineHeights.body};}
              ul{margin-top:0;}
              select{padding:8px;}
              h1,h2,h3,h4,h5,h6{text-rendering:optimizelegibility;line-height:${theme.lineHeights.heading};}
              input,select,textarea{padding:4px;border:solid 2px #aed7ff;font-size:16px;font-family:${theme.fonts.body};}
              select{-webkit-appearance:menulist;height:32px;}
              table{border-collapse:collapse;}
              input{text-align:inherit;padding-left:4px;}
              a{color:${theme.colors.primary}; }
            `}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
~~~~

Now when we load `localhost:3000` we will see some styling already applied to this page. To add more styling to our components, we will be using Theme UI and the `sx` prop. 

> The `sx` prop lets you style elements inline, using values from your theme. To use the `sx` prop, add the custom `/** @jsx jsx */` pragma comment to the top of your module and import the `jsx` function.

Take a look at the [Theme UI Docs](https://theme-ui.com/getting-started) for more, and also get familiar with the [Styled System CSS docs](https://styled-system.com/css/#theme-keys).

Let’s get started by making a `PageContainer` and `Heading` components that we can use on multiple views in the app.

First, let’s talk about how to do responsive styling in Theme UI. Under the hood, Theme UI uses [Styled System](https://styled-system.com/), which is a system for passing style props to components. 

Styled System makes it really easy to apply responsive styles to our components. We can change our styling properties to use an array syntax to apply different values across the breakpoints defined in our theme. Read more about it in Styled System’s [Responsive Styles Documentation](https://styled-system.com/responsive-styles).

For example, in `PageContainer`, we can reduce the side padding on our smallest breakpoint to 3 levels instead of 4 (we defined spacing levels and breakpoints in `Theme.js`).

*components/PageContainer.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'

export default (props) => (
  <div sx={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    px: [3,4],
    pb: 5,
  }}>{props.children}</div>
)
~~~~

*components/Heading.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'

export default (props) => (
  <h1 sx={{
    fontSize:6,
    pb:3,
    color:'primary',
    fontWeight: 400,
  }}>{props.children}</h1>
)
~~~~

Let’s change the `h1` on our landing page to our new `Heading` component and wrap the content in `PageContainer`.

*pages/index.js*

~~~~
import Head from 'next/head'
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import PageContainer from '../components/PageContainer'
import Heading from '../components/Heading'

export default () => (
  <App>
    <Head>
      <title>Team Health Checker</title>
    </Head>
    <PageContainer>
      <Heading>Team Health Checker</Heading>
      <HealthCheckCreator />
    </PageContainer>
  </App>
)
~~~~

Next up, we will update `HealthCheckCreator`.

*components/HealthCheckCreator.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react';
import { Mutation } from 'react-apollo'
import { createHealthCheckMutation } from '../api/operations'
import Link from 'next/link'

export default (props) => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {
        id ? (
          <>
            <h2>You created a new Health Check!</h2>
            <p sx={{p:4, fontSize:3}}>
              <Link prefetch href={'/check/'+id}>
                <a>View health check</a>
              </Link>
            </p>
            <div sx={{width:'100%', maxWidth:'480px', p:3}}>
              <p>You can share it with your friends by sharing this link:</p>
              <input sx={{width:'100%', p:3}} readonly type="text" value={window.location.href+'/check/'+id} /> 
            </div>
          </>
        ) : (
          <>
            <p>Health checks help you find out how your team is doing, and work together&nbsp;to&nbsp;improve.</p>
            <p sx={{pb:4}}>This health check is based on <a sx={{whiteSpace:'nowrap'}} href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
            <Mutation 
              mutation={createHealthCheckMutation} 
              onCompleted={(data) => {setId(data.createHealthCheck.id)}}
            >
              {
                createMutation => <button 
                  onClick={() => {
                    setLoading(true)
                    createMutation()
                  }}
                  children = {loading ? 'Loading...' : 'Create New Health Check'}
                />
              }
            </Mutation>
          </>
        )
      }
    </>
  )
}
~~~~

Let’s create a new `HealthCheckBegin` component for the beginning of the health check to make it more friendly to anyone that lands on the link shared with them.


*components/HealthCheckBegin.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import Heading from './Heading'


const HealthCheckBegin = (props) => {

  return (
    <>
      <Heading>Begin Team Health&nbsp;Check</Heading>
      <p sx={{py:3}}>Health checks help you find out how your team is doing, and work together to improve.</p>
      <p sx={{pb:3}}>This health check is based on <a target="_blank" href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
      <button sx={{bg:'green', fontSize:3}} onClick={props.onBegin}>Begin Health Check</button>
    </>
  )
}

HealthCheckBegin.propTypes = {
  onBegin: PropTypes.func.isRequired
}

export default HealthCheckBegin
~~~~

Let’s update our Health Check page by importing our new `HealthCheckBegin` into component and render it in the `READY` state and wrapping the content in `PageContainer`.

*pages/check.js*

~~~~
...
return (
  <PageContainer>
    {{
      READY: <HealthCheckBegin onBegin={() => setCurrView(views.IN_PROGRESS)} />,
      IN_PROGRESS: <HealthCheck id={id} onComplete={() => { this.setState({view: this.views.COMPLETE}) }} />,
      COMPLETE: <HealthCheckComplete id={id} />
    } [currView] }
  </PageContainer>
)
...
~~~~

Now onto the health check itself. Let’s make a `HealthCheckTopic` component and a `TopicButton` component for collecting the responses.

*components/TopicButton*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'

const TopicButton = (props) => (
  <div sx={{fontSize: 3, my:2, pl:4, pr:3, py:3, border: props.checked ? 'solid 3px' : 'solid 1px', borderColor: props.color, borderRadius:0, position: 'relative'}}>
    <span sx={{height:0, width: 0, position: 'absolute', top: props.checked ? '14px' : '12px', left: '24px', cursor: 'pointer'}}>
      <input onChange={props.onChange} checked={props.checked}  type="radio" id={props.id} name={props.name} value={props.value} />
    </span>
    <label sx={{width:160, display: 'inline-block'}} htmlFor={props.id}>{props.label}</label>
  </div>
)

TopicButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
}

export default TopicButton
~~~~

*components/HealthCheckTopic.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { ratingLabels } from '../api/operations'
import TopicButton from './TopicButton'

const HealthCheckTopic = (props) => {

  const [currRating, setCurrRating] = useState(null)
  
  const onRatingChange = e => {
    setCurrRating(parseInt(e.target.value))
  }

  const onRatingConfirm = e => {
    props.onConfirm(currRating)
    setCurrRating(null)
  }
  
  return (
    <>
      <h2 sx={{color:props.color, fontSize:5, pb:2}}>{props.topic.title}</h2>
      <TopicButton color={props.color} id={ratingLabels[2]} name="rating" label={ratingLabels[2]} value="2" onChange={onRatingChange} checked={currRating === 2}>{props.topic.pos}</TopicButton>
      <TopicButton color={props.color} id={ratingLabels[1]} name="rating" label={ratingLabels[1]} value="1" onChange={onRatingChange} checked={currRating === 1} />
      <TopicButton color={props.color} id={ratingLabels[0]} name="rating" label={ratingLabels[0]} value="0" onChange={onRatingChange} checked={currRating === 0}>{props.topic.pos}</TopicButton>
      <button sx={{mt:4}} disabled={currRating == null} onClick={onRatingConfirm}>Next</button>
    </>
  )
}

HealthCheckTopic.propTypes = {
  topic: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

export default HealthCheckTopic
~~~~

Next, we can update the `HealthCheck` component which contains both the topics and the confirmation step, for which we will create a `RatingRow` component for listing the ratings made for each topic before confirming. In addition, we have added a Start Over button link to clear out the responses and let them start fresh from the beginning.

*components/RatingRow*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'

const RatingRow = (props) => (
  <div sx={{diplay:'flex',flexWrap:'wrap',width:'100%',maxWidth:'500px',mx:'auto',fontSize:[2,2,3],py:2}} key={props.title}>
    <div sx={{color: 'gray', display:'inline-block',width:['100%','50%'],textAlign:['center','right']}}>{props.title}</div> 
    <div sx={{pl:3,display:'inline-block',width:['100%','50%'],textAlign:['center','left'],fontWeight:'bold'}}>{props.rating}</div>   
  </div>
)

RatingRow.propTypes = {
  title: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
}

export default RatingRow
~~~~


*components/HealthCheck.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topics, ratingLabels } from '../api/operations'
import HealthCheckTopic from './HealthCheckTopic'
import RatingRow from './RatingRow'

const HealthCheck = (props) => {

  const [ratings, setRatings] = useState([])
  const [isDone, setIsDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const colors = ['orange','purple','cyan','pink','green','primary']
  
  const currTopic = ratings.length
  
  const onConfirmRating = (rating) => {
    setRatings(ratings.concat([rating]))
  }

  return (
    <>
      {
        ratings.length === topics.length ? (
          <Mutation
            mutation={createHealthCheckResponseMutation} 
            variables={{ ratings, healthCheckId: props.id }}
            onCompleted={props.onComplete}
            refetchQueries={() => {
              return [{
                query: getHealthCheckQuery,
                variables: { id: props.id }
              }]
            }}
            awaitRefetchQueries={true}
          >
            {
              createMutation => {
                return (
                  <>
                    <h2 sx={{fontSize:1, color: 'primary', pb:3}}>Review your responses</h2>
                    {
                      ratings.map((rating, i) => {
                        return <RatingRow key={topics[i].title} title={topics[i].title} rating={ratingLabels[rating]} />
                      })
                    }
                    <div sx={{textAlign:'center'}}>
                      <a sx={{mr:4}} href="#" onClick={() => { setRatings([]) }}>Start Over</a>
                      <button 
                        sx={{mt:4}}
                        onClick={() => {
                          setLoading(true)
                          createMutation()
                        }}
                        children = {loading ? 'Saving...' : 'Confirm'}
                      />
                    </div>
                  </>
                )
              }
            }
          </Mutation>
        ) : (
          <>
            <HealthCheckTopic color={colors[ratings.length % colors.length]} topic={topics[currTopic]} onConfirm={onConfirmRating}></HealthCheckTopic>
          </>
        )
      }
    </>
  )
}

HealthCheck.propTypes = {
  id: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired
}

export default HealthCheck
~~~~

Let’s update our `HealthCheckComplete` component as well.

*components/HealthCheckComplete.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

export default (props) => {
  return (
  	<>
	    <h2 sx={{color:'primary',pb:5}}>Thanks for completing the health check!!</h2>
	    <Link prefetch href={'/results/'+props.id}>
	      <a sx={{fontSize:4, bg:'primary', color: 'white', borderRadius:1, p:3, px:4, textDecoration:'none'}} href={'/check/'+props.id}>View results</a>
	    </Link>
	</>
  )
}
~~~~

The last component to update is `HealthCheckResults`.

*components/HealthCheckResults.js*

~~~~
/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { getHealthCheckQuery, topics } from '../api/operations'
import theme from './Theme'
import Heading from './Heading'
import HealthCheckIcon from './HealthCheckIcon'

const RatingBadge = (props) => <span sx={{display:'inline-block', position:'relative', top: '-3px', fontSize:3, mx:1, width:'52px', py:'12px', bg:props.color, color:'white', borderRadius:1}}>{props.children}</span>

const HealthCheckResults = (props) => {

  return (
    <Query query={getHealthCheckQuery} variables={{id: props.id}}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>
        if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>

        let topicRatings = topics.map(() => { return [0,0,0] })
        const responses = data.HealthCheck.responses.forEach((response) => {
     			response.ratings.forEach((rating, topicIndex) => {
            topicRatings[topicIndex][rating]++
     			})
        })

        return (
          <div sx={{textAlign:'center', width:'100%'}}>
          	<Heading>Health Check Results</Heading>
            <p sx={{color:'gray', fontStyle:'italic'}}>{data.HealthCheck.responses.length} responses so far</p>
          	{
          		topicRatings.map((topic, topicIndex) => {
                const rating = Math.round((topic[1] + (topic[2] * 2))/data.HealthCheck.responses.length)
                const color = rating === 0 ? 'red' : rating === 1 ? 'gray' : 'green'
          			return (
                  <div sx={{display:'flex', flexWrap: 'wrap', border: 'solid 1px', borderColor:'#ddd', pt:3, pb:'13px', px:2, fontSize:5, mb:'-1px', width:'100%',maxWidth:'800px',mx:'auto'}} key={'topicRating'+topicIndex}>
                    <div sx={{width:['100%','100%','50%'], pb:[3,3,0], pt:1,color, pl:[0,0,4], display:'inline-block', textAlign: 'center', fontWeight: 'bold'}}>{topics[topicIndex].title}</div>
                    <div sx={{width:['100%','100%','50%'], textAlign: 'center'}}>
                      <RatingBadge color="red">{topic[0]}</RatingBadge>
                      <RatingBadge color="gray">{topic[1]}</RatingBadge>
                      <RatingBadge color="green">{topic[2]}</RatingBadge>
                      <span sx={{pl:'48px', pr:4, py:0, position: 'relative'}}><span sx={{position:'absolute', top:0, left:'27px'}}><HealthCheckIcon fill={theme.colors[color]} size={48} rating={rating} /></span></span>
                    </div>
            			</div>
                )
              })
          	}
          </div>
        )
      }}
    </Query>
  )
}

HealthCheckResults.propTypes = {
  id: PropTypes.string.isRequired
}

export default HealthCheckResults
~~~~

By running hot reload, courtesy of `now dev` in a browser window, and a text editor in another, making these adjustments across all the views in our app can be done pretty quickly.


## Part 6

Now that we have a working prototype of our app, we should add testing. 

Some schools of thought would say that should have been step #1, but I have found that when you are still in the creative, figuring-it-out stage, it can be best to build a stable version first, with minimal features, then add the testing, especially before the project gets too big.

## Part 7

With our tests in place, we can feel confident enough to share our app with the world, or at least some close friends. 

To deploy our app, we will use [Now](https://zeit.co/now) by [Zeit](https://zeit.co).

First, we will need to sign up for an account and install the CLI. Refer to the [docs](https://zeit.co/docs) for more info and installation instructions.

To verify you have installed and are authorized to deploy, from your CLI run:

~~~~
$ now whoami
~~~~

It should output the username you set up on now. 

Next, we need to target our deployment for a serverless environment.

*next.config.js*

~~~~
module.exports = {
  target: 'serverless'
}
~~~~

Then we create a now config file to point at our next config file and use the next build setup.

*now.json*

~~~~
{
  "version": 2,
  "builds": [{ "src": "next.config.js", "use": "@now/next" }]
}
~~~~

At the time of this writing, we have a dependency on next.js version 8 canary. It is likely by the time you read this, 8.0.0 will have been released, and no changes to `package.json` will be necessary. If not, update the version of next: 

*package.json*

~~~~
...
"next": "canary",
...
~~~~

With that done, in the command line we can run one command to deploy our project

~~~~
$ now
~~~~

https://uxplanet.org/4-creative-concepts-of-slider-control-1f8839b05943

http://blog.crisp.se/wp-content/uploads/2014/02/Team-barometer-self-evaluation-tool-Cards.pdf
https://blog.crisp.se/2014/01/30/jimmyjanlen/team-barometer-self-evaluation-tool

https://medium.com/the-liberators/agile-teams-dont-use-happiness-metrics-measure-team-morale-3050b339d8af

https://www.atlassian.com/team-playbook/health-monitor/project-teams

https://sidlee.com/en/?ref=bestwebsite.gallery
https://wellset.co/home
https://www.sysdoc.com/
https://futurecomes.com/
https://rallyinteractive.com/
http://thrivesolo.com/
https://econsultancy.com/21-first-class-examples-of-effective-web-form-design/






