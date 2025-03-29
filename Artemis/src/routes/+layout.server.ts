import { db } from "$lib/server/db";
import { genres } from "$lib/server/db/schema";
import { Cron } from "croner";
import { eq, isNotNull, isNull } from "drizzle-orm";
import { APOLLO_URL } from "$env/static/private";
import { toSnakeCase } from "drizzle-orm/casing";

const getEmbeddingsForGenres = async (genres: string[]) => {
	const url = APOLLO_URL;
	try {
		const genreEmbeddings = await fetch(`${url}/data/embeddings`, {
			method: "POST",
			body: JSON.stringify({ 
				"genres": genres
			}),
			headers: {
				"Content-Type": "application/json"
			}
		});
		return genreEmbeddings.json();
	} catch (e) {
		console.log("Apollo unavailable");
		return null;
	}
};
// every 5 seconds
const fetchGenreEmbeddings =  new Cron("*/5 * * * * *", async () => {
	console.log("fetchig genre embeddings");
	const unprocessedGenres = await db.select().from(genres).where(isNull(genres.embedding)).limit(100);
	const genreEmbeddings = await getEmbeddingsForGenres(unprocessedGenres.map((genre) => genre.name));

	for (const genre of unprocessedGenres) {
		const embedding = genreEmbeddings[genre.name];
		const _ = await db.update(genres).set({ embedding: embedding }).where(eq(genres.id, genre.id)).returning();
		console.log(`Updated genre ${genre.name} with embedding which is ${embedding}`);
	}
});

type Coordinates = {
	x: number;
	y: number;
};

type CoordinateMap = {
	[key: string]: Coordinates;
};

const tSNErequest = async () => {
	console.log("fetching tSNE");
	const url = APOLLO_URL;
	const allGenres = await db.select().from(genres).where(isNotNull(genres.embedding));
	const idToEmbeddings = allGenres.map((genre) => { 
		return {id: genre.id, embedding: genre.embedding }
	})
	const data = {
		embeddings: idToEmbeddings,
	}
	const tSNE = await fetch(`${url}/data/tSNE`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json"
		}
	});
	const result = await tSNE.json() as CoordinateMap;
	for (const genre of allGenres) {
		const coordinates = result[genre.id];
		const _ = await db.update(genres).set({ x_cor: coordinates.x, y_cor: coordinates.y }).where(eq(genres.id, genre.id)).returning();
		console.log(`Updated genre ${genre.name} with coordinates x: ${coordinates.x} y: ${coordinates.y}`);
	}
	return result;
};

// tSNErequest();
