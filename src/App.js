import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useSubscription, gql, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'https://gmeet-node-ls52.vercel.app/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://gmeet-node-ls52.vercel.app/graphql',
  connectionParams: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const PARTICIPANTS_QUERY = gql`
  query {
    participants
  }
`;

const PARTICIPANTS_SUBSCRIPTION = gql`
  subscription {
    participantsUpdated
  }
`;

function Participants() {
  const { data: queryData } = useQuery(PARTICIPANTS_QUERY);
  const { data: subscriptionData } = useSubscription(PARTICIPANTS_SUBSCRIPTION);

  const participants = subscriptionData ? subscriptionData.participantsUpdated : (queryData ? queryData.participants : []);

  return (
    <div className="App">
      <h1>Google Meet Participants -v2.2</h1>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Participants />
    </ApolloProvider>
  );
}

export default App;
