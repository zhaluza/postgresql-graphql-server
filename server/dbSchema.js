const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const joinMonster = require('join-monster');
const db = require('./dbConnect');

const Player = new GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    team: {
      type: Team,
      sqlJoin: (playerTable, teamTable, args) =>
        `${playerTable}.team_id = ${teamTable}.id}`,
    },
  }),
});

Player._typeConfig = {
  sqlTable: 'player',
  uniqueKey: 'id',
};

const Team = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    players: {
      type: GraphQLList(Player),
      sqlJoin: (teamTable, playerTable, args) =>
        `${teamTable}.id = ${playerTable}.team_id`,
    },
  }),
});

Team._typeConfig = {
  sqlTable: 'team',
  uniqueKey: 'id',
};

const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello world!',
    },
    players: {
      type: new GraphQLList(Player),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      },
    },
    player: {
      type: Player,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      where: (playerTable, args, context) => `${playerTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      },
    },
  }),
});

const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    player: {
      type: Player,
      args: {
        first_name: { type: GraphQLNonNull(GraphQLString) },
        last_name: { type: GraphQLNonNull(GraphQLString) },
        team_id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (
            await db.query(
              `INSERT INTO player(first_name, last_name, team_id) VALUES ($1, $2, $3) RETURNING *`[
                (args.first_name, args.last_name, args.team_id)
              ]
            )
          ).rows[0];
        } catch (err) {
          throw new Error('Failed to insert new player');
        }
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
});

module.exports = schema;
