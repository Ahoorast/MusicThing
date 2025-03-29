from numbers import Number
from typing import List
from fastapi import FastAPI
from lib.data import embeddings
from lib.data import tSNE
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers.trainer_callback import np


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


class GenreRequest(BaseModel):
    genres: List[str]


@app.post("/data/embeddings")
async def get_embeddings(genreRequest: GenreRequest):
    genreEmbeddings = embeddings.get_embeddings(genreRequest.genres)
    response = {}
    for i, genre in enumerate(genreRequest.genres):
        response[genre] = genreEmbeddings[i].tolist()
    return response


class IdToEmbedding(BaseModel):
    id: int
    embedding: List[float]

class TSNERequest(BaseModel):
    embeddings: List[IdToEmbedding]

@app.post("/data/tSNE")
async def get_tsne(request: TSNERequest):
    request_embeddings = []
    for embedding in request.embeddings:
        request_embeddings.append(embedding.embedding)
    tSNEResult = tSNE.plot_genre_embeddings_tsne(np.array(request_embeddings))
    response = {}
    for [x, y], embedding in zip(tSNEResult, request.embeddings):
        response[embedding.id] = {
            "x": x,
            "y": y,
        }
    return response
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8321, reload=True)
