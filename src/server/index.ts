import '@dotenvx/dotenvx/config';
import {serve} from '@hono/node-server';
import {connectionProvider, PushProcessor} from '@rocicorp/zero/pg';
import {Hono} from 'hono';
import postgres from 'postgres';
import {mutators} from '../shared/mutators.ts';
import {schema} from '../shared/schema.ts';

const app = new Hono();

app.get('/', c => c.text('OK'));

const processor = new PushProcessor(
  schema,
  connectionProvider(
    postgres(
      must(
        process.env.ZERO_UPSTREAM_DB as string,
        'required env var ZERO_UPSTREAM_DB',
      ),
    ),
  ),
);

function must<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

app.post('/api/push', async c => {
  const queryString = c.req.query();
  const body = await c.req.json();
  const res = await processor.process(mutators, queryString, body);
  return Response.json(res);
});

const server = serve({
  fetch: app.fetch,
  port: 3001,
});

server.on('listening', () => {
  const address = server.address();
  if (address && typeof address !== 'string') {
    console.log(`Server is running on http://localhost:${address.port}`);
  }
});
