// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_BOC_API_URL, // Replace with your actual GraphQL endpoint
  cache: new InMemoryCache(),
});
console.log("Apollo Client URL:", process.env.NEXT_PUBLIC_BOC_API_URL); // Debug log

export default client;
