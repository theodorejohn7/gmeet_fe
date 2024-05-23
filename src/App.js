import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useSubscription, gql } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const client = new ApolloClient({
  link: new GraphQLWsLink(createClient({
    url: 'ws://gmeet-node-ls52.vercel.app/graphql',
  })),
  cache: new InMemoryCache()
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
      <h1>Google Meet Participants -v2</h1>
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
