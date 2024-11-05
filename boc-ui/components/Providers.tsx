"use client";

import { Web3Provider } from "@/app/Web3Provider";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </Web3Provider>
  );
}
