from typing import List
from sentence_transformers import SentenceTransformer
from transformers.trainer_callback import np


model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embeddings(genres: List[str]) -> np.ndarray:
    embeddings = model.encode(genres)
    return embeddings
