import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://grants-stack-indexer-v2.gitcoin.co/graphql",
  cache: new InMemoryCache(),
});
