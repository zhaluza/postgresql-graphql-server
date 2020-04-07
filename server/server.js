const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');
const app = express();
const PORT = 3000;

const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => 'Hello world!',
    },
  }),
});

const schema = new graphql.GraphQLSchema({ query: QueryRoot });

app.use(
  '/api',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
