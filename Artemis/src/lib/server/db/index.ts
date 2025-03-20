import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
// import { env } from '$env/dynamic/private';
//if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres("postgres://root:mysecretpassword@localhost:5435/local");

export const db = drizzle(client, {
	schema
});
