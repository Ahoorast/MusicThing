import { real } from 'drizzle-orm/gel-core';
import { pgTable, serial, text, integer, vector, numeric } from 'drizzle-orm/pg-core';

export const genres = pgTable("genre", {
	id: serial().primaryKey(),
	name: text("name").unique().notNull(),
	embedding: vector('embedding', { dimensions: 384 }),
	x_cor: numeric("x_cor"),
	y_cor: numeric("y_cor"),
});
