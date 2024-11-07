"use client";

import { Web3Provider } from "@/app/Web3Provider";
import { ApolloProvider } from "@apollo/client";
import { ModalProvider } from "@/context/ModalContext";

import client from "@/lib/apolloClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <ApolloProvider client={client}>
        <ModalProvider>{children} </ModalProvider>
      </ApolloProvider>
    </Web3Provider>
  );
}
