import { db } from "$lib/server/db";
import { genres } from "$lib/server/db/schema";
import { Cron } from "croner";
import { eq, isNull } from "drizzle-orm";
import { APOLLO_URL } from "$env/static/private";

const getEmbeddingsForGenres = async (genres: string[]) => {
	const url = APOLLO_URL;
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
