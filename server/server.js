const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const PORT = 3000;
require('dotenv').config();

const schema = require('./dbSchema');

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
