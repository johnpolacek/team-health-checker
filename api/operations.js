import gql from 'graphql-tag';

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
    pos:'We’re proud of the quality of our code! It is clean, easy to read and has great test coverage.',
    neg:'Our code is a pile of dung and technical debt is raging out of control.'
  },
  {
    title:'Delivering Value',
    pos:'We deliver great stuff! We’re proud of it and our stakeholders are really happy.',
    neg:'We deliver crap. We feel ashamed to deliver it. Our stakeholders hate us.'
  },
  {
    title:'Speed',
    pos:'We get stuff done really quickly! No waiting and no delays.',
    neg:'We never seem to get anything done. We keep getting stuck or interrupted. Stories keep getting stuck on dependencies.'
  },
  {
    title:'Mission',
    pos:'We know exactly why we are here and we’re really excited about it!',
    neg:'We have no idea why we are here, there’s no high lever picture or focus. Our so called mission is completely unclear and uninspiring.'
  },
  {
    title:'Fun',
    pos:'We love going to work and have great fun working together!',
    neg:'Boooooooring...'
  },
  {
    title:'Learning',
    pos:'We’re learning lots of interesting stuff all the time!',
    neg:'We never have time to learn anything.'
  },
  {
    title:'Support',
    pos:'We always get great support and help when we ask for it!',
    neg:'We keep getting stuck because we can’t get the support and help that we ask for.'
  },
  {
    title:'Pawns or Players',
    pos:'We are in control of our own destiny! We decide what to build and how to build it.',
    neg:'We are just pawns in a game of chess with no influence over what we build or how we build it.'
  },
  {
    title:'Teamwork',
    pos:'We are a totally gelled super-team with awesome collaboration!',
    neg:'We are a bunch of individuals that neither know nor care about what the other people are doing.'
  }
]
export const ratingLabels = {
  0: 'Sucky',
  1: 'OK',
  2: 'Awesome'
}

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