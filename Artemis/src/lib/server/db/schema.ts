import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const genres = pgTable("genre", {
	id: serial().primaryKey(),
	name: text().unique().notNull(),
});
