import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { AuthResolver } from './resolvers/auth-resolver';
import { addAuthMiddleware } from './middleware/auth';
import { UserResolver } from './resolvers/user-resolver';
import { sequelize } from '../database';
import { User } from './dto/model/user-model'
import { TvShowResolver } from './resolvers/tv-show-resolver';
import { EpisodeResolver } from './resolvers/episode-resolver';
import { ActorResolver } from './resolvers/actor-resolver';
import { createSchema } from './utils/createSchema';


const app = express();

async function main() {
  await sequelize.authenticate();
  await sequelize.sync();

  const schema = await createSchema()

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req, user: undefined }),
  });


  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

main();