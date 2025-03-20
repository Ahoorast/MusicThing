// fetch all genres from evernoise.com
//
async function createGenre(name) {
  // Perform the fetch with the provided name
  await fetch("http://localhost:3000", {
    headers: {
      "accept": "*/*",
      "content-type": "application/json",
    },
    body: name,
    method: "POST",
    mode: "no-cors" 
  })
}


let genres = document.getElementsByClassName('genre scanme');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

for (let i = 0; i < genres.length; i++) {
    console.log(i + " / " + genres.length);
    await createGenre(genres[i].innerText);
    if (i % 1000 == 0) {
        await sleep(5000);
        console.log(i);
    }
}
