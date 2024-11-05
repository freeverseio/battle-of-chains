import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { stitchSchemas } from '@graphql-tools/stitch';
import * as dotenv from 'dotenv';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import 'reflect-metadata'; // Required by TypeGraphQL
import { AppDataSource } from './db/AppDataSource';
import { schemaFromExecutor } from '@graphql-tools/wrap';
import { 
  localResolvers,
  localTypeDefs,
} from './resolvers/MainResolver';


async function getRemoteSchema() {
  const postgraphileUrl = process.env.POSTGRAPHILE_URL || 'http://localhost:4002/graphql';

  // Crear un ejecutor HTTP
  const remoteExecutor = buildHTTPExecutor({ endpoint: postgraphileUrl });

  // Obtener el esquema remoto utilizando el ejecutor HTTP
  const schema = await schemaFromExecutor(remoteExecutor);

  return { schema, executor: remoteExecutor };
}

async function makeGatewaySchema() {
  // Remote executor for your indexer service
  const schema = await getRemoteSchema();

  // Stitch the TypeGraphQL schema with the remote and local schemas
  const finalSchema = stitchSchemas({
    subschemas: [schema],
    resolvers: [localResolvers],
    typeDefs: [localTypeDefs]
  });

  return finalSchema;
}

const allowedOrigins = process.env.CORS_ALLOWED_DOMAINS
  ? process.env.CORS_ALLOWED_DOMAINS.split(',')
  : '*';

(async () => {
  dotenv.config();
  const schema = await makeGatewaySchema();

  // Yoga server setup
  const gatewayApp = createYoga({
    schema,
    context: ({ request }) => ({
      authHeader: request.headers.get('authorization'),
    }),
    maskedErrors: false,
    graphiql: {
      title: 'The Battle of Chains API',
      headers: `{"x-api-key": "my-secret-api-key"}`,
      defaultQuery: `
      query MyQuery {
        users {
          address
          chainId
          coordinates {
            x
            y
          }
        }
      }
    `,
    },
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });


  AppDataSource.initialize()
  .catch((error) => console.log("Error: ", error));


  const server = createServer(gatewayApp);
  server.listen(4000, () => console.log('Gateway running at http://localhost:4000/graphql'));
})();
