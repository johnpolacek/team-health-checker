# Building a Free Open Source Team Health Check Web App with React, Next.js, GraphQL

## Part 1

Even though I am primarily a front end developer, I find that for any project, starting from a data schema first approach is a good one. 

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
const getHealthCheckQuery = gql`query HealthCheck($id: ID!) {
  HealthCheck(id: $id) {
    id
    responses {
      id
      ratings
    }
  }
}`

export default class extends React.Component {
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
          <h2>You created a new Health Check!</h2>
            <div>
              <p>You can share it with your friends by sharing this link:</p>
              <input readonly type="text" value={window.location.href+'/healthcheck/'+id} /> 
            </div>
            <p>
              <Link prefetch href={'/healthcheck/'+id}>
                <a>View health check</a>
              </Link>
            </p>
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
    <div>
      <p>Health checks help you find out how your team is doing, and work together to improve.</p>
      <p>This health check is based on <a href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
    </div>
    <HealthCheckCreator />
  </App>
)
~~~~

Test it out and you after you click on the link, you should land on the health check page with the message indicating the load for that id was successful.

To see the failure state, go to `http://localhost:3000/healthcheck/123` and there should be an error message that the health check with id 123 could not be found.

##Part 3

For the next part of developing this app, we will allow people to fill in the health check responses.

We won’t worry about styling or a great user experience just yet, as this is just an exploratory proof-of-concept at this point.

Let’s add a component that allows people to provide responses to each of the topics.

*pages/healthcheck.js*

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

const HealthCheck = (props) => {

  const [currRating, setCurrRating] = useState(null)
  const [ratings, setRatings] = useState([])
  
  const topicTitles = ['Easy to release','Suitable Process','Tech Quality','Value','Speed','Mission','Fun','Learning','Support','Pawns']
  const currTopic = ratings.length

  const onChange = e => {
    setCurrRating(parseInt(e.target.value))
  }

  const onConfirmRating = () => {
    const newRatings = ratings.concat([currRating])
    if (newRatings.length === topicTitles.length) {
      props.onComplete(newRatings)
    } else {
      setRatings(newRatings)
      setCurrRating(null)
    }  
  }

  return (
    <>
      <h2>{topicTitles[currTopic]}</h2>
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

*pages/healthcheck.js*

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

Another way to write this could be with a switch statement or a series of simple conditional checks.

~~~~
{
  this.state.view == this.views.READY &&
  <>
    <h1>Loaded HealthCheck id: {this.props.id}</h1>
    <button onClick={() => this.setState({view: this.views.IN_PROGRESS})}>Begin health check</button>
  </>
}
{
  this.state.view == this.views.IN_PROGRESS &&
  <HealthCheck onComplete={() => {
    console.log('COMPLETE!')
    this.setState({view: this.views.COMPLETE})}} 
  />
}
{
  this.state.view == this.views.COMPLETE &&
  <p>Thanks for completing the health check!</p>
}
~~~~

##Part 4

In the last part, we created a component for a user to enter their responses to a health check, but we didn’t do anything with them. Now we need to store their answers in our GraphQL database and display them. 

To achieve this, as we did when creating a new health check, we will be creating a mutation, in this case a nested create mutation (see the [Graphcool docs](https://www.graph.cool/docs/reference/graphql-api/mutation-api-ol0yuoz6go#nested-create-mutations)), to add the health check response and link it to the id of the health check.

Update the health check component with a confirm step to send the completed response to the database.

*components/HealthCheck.js*

~~~~
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const createHealthCheckResponseMutation = gql`
  mutation createHealthCheckResponse($ratings: [Int!]!, $healthCheckId: ID!) {
    createHealthCheckResponse(ratings: $ratings, healthCheckId: $healthCheckId) {
      id
    }
  }
`

const HealthCheck = (props) => {

  const [currRating, setCurrRating] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)
  
  // const topicTitles = ['Easy to release','Suitable Process','Tech Quality','Value','Speed','Mission','Fun','Learning','Support','Pawns']
  const topicTitles = ['Easy to release','Suitable Process']
  const currTopic = ratings.length
  const ratingLabels = {
    0: 'Sucky',
    1: 'OK',
    2: 'Awesome'
  }

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
        ratings.length === topicTitles.length ? (
          <Mutation 
            mutation={createHealthCheckResponseMutation} 
            variables={{ ratings, healthCheckId: props.id }}
            onCompleted={(data) => {
              console.log('createHealthCheckResponseMutation onCompleted', data)
              props.onComplete(ratings)
            }}
          >
            {
              createMutation => {
                return (
                  <>
                    {
                      ratings.map((rating, i) => {
                        return (<div key={topicTitles[i]}>{topicTitles[i]}: {ratingLabels[rating]}</div>)
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
            <h2>{topicTitles[currTopic]}</h2>
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

Next, we need a way to review all the health check responses and see the results of all the completed health checks. We will make a HealthCheckComplete component and again use a Query to pull the data from GraphQL.

Rather than defining our queries and mutations within the various components, it makes sense to bring them all together in one file and import them in as needed. While we’re at it, let’s put our `topicTitles` array in there as well since we’ll want to share that across our app.

*api/operations.js*

~~~~
import gql from 'graphql-tag';

export const topicTitles = ['Easy to release','Suitable Process','Tech Quality','Value','Speed','Mission','Fun','Learning','Support','Pawns']

export const getHealthCheckQuery = gql`query HealthCheck($id: ID!) {
  HealthCheck(id: $id) {
    id
    responses {
      id
      ratings
    }
  }
}`

export const createHealthCheckMutation = gql`
  mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
    createHealthCheck(responses: $responses) {
      id
    }
  }
`

export const createHealthCheckResponseMutation = gql`
  mutation createHealthCheckResponse($ratings: [Int!]!, $healthCheckId: ID!) {
    createHealthCheckResponse(ratings: $ratings, healthCheckId: $healthCheckId) {
      id
    }
  }
`
~~~~

Now, for the HealthCheckComplete component, we will once again wrap the content in a Query component that will pass the GraphQL data to its children.

To display the results, we can iterate through the responses and increment the values (Awesome/OK/Sucky) for each topic.

*components/HealthCheckComplete.js*

~~~~
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { getHealthCheckQuery, topicTitles } from '../api/operations'

const HealthCheckComplete = (props) => {

  return (
    <Query query={getHealthCheckQuery} variables={{id: props.id}}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>
        if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>

        let topicRatings = topicTitles.map(() => { return [0,0,0] })
        const responses = data.HealthCheck.responses.forEach((response) => {
          response.ratings.forEach((rating, topicIndex) => {
            topicRatings[topicIndex][rating]++
          })
        })

        return (
          <>
            <p>Complete! Here are the results:</p>
            {
              topicRatings.map((topic, topicIndex) => 
                <div key={'topicRating'+topicIndex}>
                  <h3>{topicTitles[topicIndex]}</h3>
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

HealthCheckComplete.propTypes = {
  id: PropTypes.string.isRequired
}

export default HealthCheckComplete

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

We have a basic working proof-of-concept for the Health Check web app. Now it is time to improve the design and make it more user-friendly.

You don’t need to use CSS-in-JS to build React Apps, but styles are often closely tied to state at the component layer, so for that and other reasons, it is quite popular. Let’s do it!

First off, let’s set up some theming configuration for colors, typography and spacing. To do this, we will use a [ThemeProvider component](https://www.styled-components.com/docs/advanced#theming) from [styled components](https://www.styled-components.com/)

~~~~
$ npm i styled-components
~~~~

ThemeProvider doesn’t do much without a theme, so let’s set up some properties we can use to style all our UI components.

*theme.js*

~~~~
export const font = `'avenir next', avenir, helvetica, arial, sans-serif`;
export const monospace = `"SF Mono", "Roboto Mono", Menlo, monospace`
export const fontSizes = [12,14,16,20,24,32,48,64,72,96]
export const weights = [200,400,700]

export const colors = {
  "base": "#4169e1",
  "black": "#000",
  "blue": "#4169e1",
  ....
}

export const breakpoints = ['32em','48em','64em','80em']
export const space = [0,4,8,16,32,64,128]
export const radius = 4

export default {
  font,
  monospace,
  fontFamilies,
  weights,
  fontSizes,
  colors,
  breakpoints,
  space,
  radius
}
~~~~

[Next.js](https://nextjs.org) has a [bare-bones example](https://github.com/zeit/next.js/tree/master/examples/with-styled-components) of using [styled-components](https://www.styled-components.com/) with server-side rendering so that we can ship a minimal amount of CSS on page load. 

The killer feature here is that no matter which page someone lands on, they will automatically get the critical css for that page inlined into the document head.

We can also apply [normalize.css](https://necolas.github.io/normalize.css/) and any other css we want to apply to every page across our web app.

*pages/_document.js*

~~~~
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  // normalize.css v8.0.0 | github.com/necolas/normalize.css */
  const headCSS = `/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */
button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}
html{box-sizing:border-box;} *,*:before,*:after{box-sizing:inherit;} 
body{margin:0;font-family:'Nunito',sans-serif;line-height:1.6;overflow-x:hidden;}`

  render () {
    return (
      <html lang="en">
        <Head>
          <title>Team Health Checker</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#000000" />
          <style>{headCSS}</style>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
~~~~

[Styled System](https://jxnblk.com/styled-system/) is a library that provides responsive, theme-based style props for our React UI components. By default, it works with [styled components](https://styled-components.com), and we will be using a library called [Styled System HTML](https://johnpolacek.github.io/styled-system-html/) which gives us a set of low level html element components ready for stateful theming.

~~~~
$ npm i styled-system-html
~~~~

Now that we have our theme settings and some low level UI components, let’s make our landing page a little more appealing.

We can switch the html elements to our components which can accept style props and data from our design theme. Eventually, we can abstract these further into UI components with default styling props so we don't need to repeatedly declare padding, font size, etc.

*pages/index.js*

~~~~
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import { Div, H1, P } from 'styled-system-html'

export default () => (
  <App>
    <Div textAlign="center" py={54}>
      <H1 color="base" pt={4} pb={3} fontSize={8} fontWeight="400">Team Health Checker</H1>
      <P pb={5} fontSize={3}>Health checks help you find out how your team is doing, and work together to improve.</P>
      <HealthCheckCreator />
  </Div>
  </App>
)
~~~~

*components/HealthCheckCreator.js*

~~~~
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import { createHealthCheckMutation } from '../api/operations'
import Link from 'next/link'
import { Div, H2, P, A, Button, Input } from 'styled-system-html'

const HealthCheckCreator = () => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Div px={3}>
      {
        id ? (
          <>
            <H2 color="green" pb={4} fontSize={5} fontWeight="600">You created a new Health Check!</H2>
            <Div pb={4}>
              <P pb={3} fontSize={3}>You can share it with your friends by sharing this link:</P>
              <Input width={340} p={2} readonly type="text" value={window.location.href+'/healthcheck/'+id} /> 
            </Div>
            <P py={4}>
              <Link prefetch href={'/healthcheck/'+id}>
                <A href={'/healthcheck/'+id} bg="cyan" color="white" fontSize={4} py={3} px={4} borderRadius="8px" style={{textDecoration:'none'}}>View Health Check</A>
              </Link>
            </P>
          </>
        ) : (
          <Mutation 
            mutation={createHealthCheckMutation} 
            onCompleted={(data) => {setId(data.createHealthCheck.id)}}
          >
            {
              createMutation => <Button 
                bg="green" color="white" 
                fontSize={4} fontWeight="{2}"
                py={3} px={4} borderRadius="8px"
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
    </Div>
  )
}

export default HealthCheckCreator
~~~~

Next up, let’s create a new component for the beginning of the health check to make it more friendly to anyone that lands on the link shared with them.

*components/HealthCheckBegin.js*

~~~~
import PropTypes from 'prop-types'
import { Div, H1, P, A, Button } from  'styled-system-html'

const HealthCheckBegin = (props) => {

  return (
    <Div textAlign="center" py={4}>
      <H1 color="base" pt={4} pb={3} fontSize={8} fontWeight="400">Begin Team Health Check</H1>
      <Div pt={3} pb={4} fontSize={3}>
        <P pb={3}>Health checks help you find out how your team is doing, and work together to improve.</P>
        <P pb={3}>This health check is based on <A target="block" color="cyan" href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</A>.</P>
      </Div>
      <Button bg="green" color="white" fontSize={4} fontWeight="{2}"py={3} px={4} borderRadius="8px" onClick={props.onBegin}>
        Begin Health Check
      </Button>
    </Div>
  )
}

HealthCheckBegin.propTypes = {
  onBegin: PropTypes.func.isRequired
}

export default HealthCheckBegin
~~~~

Let’s import our new `HealthCheckBegin` into component our healthcheck page and render it in the `READY` state.

*pages/healtcheck.js*

~~~~
...
return (
  <>
    {{
      READY: <HealthCheckBegin onBegin={() => this.setState({view: this.views.IN_PROGRESS})} />,
      IN_PROGRESS: <HealthCheck id={this.props.id} onComplete={() => { this.setState({view: this.views.COMPLETE}) }} />,
      COMPLETE: <HealthCheckComplete id={this.props.id} />
    }[this.state.view]}
  </>
)
...
~~~~

Now onto the health check itself. Let’s make a HealthCheckTopic component for collecting the responses.

*components/HealthCheckTopic.js*

~~~~

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

## Part 6

Dang. When I built this thing it was for my team to do together with all our laptops open, either in a room together or remote. So, I did not take a ‘mobile first’ design approach when building this app.

Luckily, Styled System makes it really easy to adapt a site for any screen size.

## Part 7

Now that we have a working prototype of our app, we should add testing. 

Some schools of thought would say that should have been step #1, but I have found that when you are still in the creative, figuring-it-out stage, it can be best to build a stable version first, with minimal features, then add the testing, especially before the project gets too big.

## Part 8

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
