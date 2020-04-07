# GraphQL API w/ Express & PostgreSQL

A basic example of a graphQL API connected to PostgreSQL. Inspired by this [Snipcart](https://snipcart.com/blog/graphql-nodejs-express-tutorial) article, but refactored and modularized to simulate a more realistic project structure.

## Setup

1. Install all npm packages with `npm install`.
2. Create a database with three tables: `team`, `player`, and `match`.
3. Create the tables with the following queries:

```sql
CREATE TABLE team (
  id SERIAL PRIMARY KEY,
  name VARCHAR (255)
);
CREATE TABLE player (
 id SERIAL PRIMARY KEY,
 first_name VARCHAR (255),
 last_name VARCHAR (255),
 team_id INT NOT NULL REFERENCES team (id)
);
CREATE TABLE match (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  winner_team_id INT NOT NULL REFERENCES team (id),
  loser_team_id INT NOT NULL REFERENCES team (id)
);
```

4. Create a `.env` file in the root directory. Inside the file, type `PG_URI=`, followed by your db URI (no quotes). _(Alternately, you could replace `env.process.PG_URI` in the `dbConnect.js` file with your own db URI.)_
5. Spin up the server with `npm start`.
6. Go to `http://localhost:3000/api` in your browser.
7. Use the GraphiQL interface to make query and mutation requests.
