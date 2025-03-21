from typing import List
from fastapi import FastAPI
from lib.data import embeddings
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers.trainer_callback import np


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


class GenreRequest(BaseModel):
    genres: List[str]

@app.get("/data/embeddings")
async def get_embeddings(genreRequest: GenreRequest):
    genreEmbeddings = embeddings.get_embeddings(genreRequest.genres)
    response = {}
    for i, genre in enumerate(genreRequest.genres):
        response[genre] = genreEmbeddings[i].tolist()
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8321, reload=True)
