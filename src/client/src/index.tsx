import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"
import { createUploadLink } from 'apollo-upload-client';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
})


const client = new ApolloClient({
  cache: new InMemoryCache(),
  // @ts-ignore
  link: uploadLink
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);




