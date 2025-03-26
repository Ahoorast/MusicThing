import { pgTable, serial, text, integer, vector } from 'drizzle-orm/pg-core';

export const genres = pgTable("genre", {
	id: serial().primaryKey(),
	name: text().unique().notNull(),
	embedding: vector('embedding', { dimensions: 512 })
});
