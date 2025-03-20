import { db } from "$lib/server/db";
import { genres } from "$lib/server/db/schema";

var path = './Ahoora/';

const server = Bun.serve({
    port: 3000,
    async fetch(request: Request) {
        let genre = await request.text();
        const res = new Response(genre);
        try {
            await db.insert(genres).values({ name: genre }).returning();
            console.log('Inserted genre: ' + genre);
        } catch (e) {
            console.log("could not insert genre: " + genre);
        }
        res.headers.append('Content-Type', 'text/plain');
        res.headers.append('Access-Control-Allow-Origin', 'https://everynoise.com');
        res.headers.append('Access-Control-Allow-Credentials', 'true');
        res.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.headers.append('Access-Control-Allow-Headers', 'x-csrf-token');
        res.headers.append('Access-Control-Allow-Headers', 'content-type');
        return res;
    },
});

console.log(`Listening on localhost:${server.port}`);
