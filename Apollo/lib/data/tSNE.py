from typing import Optional
import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE


def plot_genre_embeddings_tsne(
    embeddings: np.ndarray, 
    labels: Optional[np.ndarray] = None, 
    title: str = "t-SNE Visualization of Musical Genres"
):
    """
    Reduces embeddings to 2D using t-SNE and visualizes them.
    
    :param embeddings: High-dimensional embeddings (n_samples, n_features)
    :param labels: Optional genre labels for coloring the points
    :param title: Title of the plot
    """
    # Step 1: Apply t-SNE
    tsne = TSNE(
        n_components=2,
        perplexity=5,
        learning_rate=200,
        n_iter=1000, 
        random_state=42
    )
    tsne_embeddings = tsne.fit_transform(embeddings)
    # turn to list
    # Step 2: Plotting
    plt.figure(figsize=(10, 8))
    if labels is not None:
        scatter = plt.scatter(tsne_embeddings[:, 0], tsne_embeddings[:, 1], c=labels, cmap='tab10', alpha=0.7)
        plt.colorbar(scatter, label="Genre")
    else:
        plt.scatter(tsne_embeddings[:, 0], tsne_embeddings[:, 1], alpha=0.7)
    
    plt.title(title)
    plt.xlabel("t-SNE Dimension 1")
    plt.ylabel("t-SNE Dimension 2")
    plt.grid(True)
    plt.show()
    return tsne_embeddings.tolist()

# Example Usage:
# Replace this with your actual embeddings and labels
# example_embeddings = np.random.rand(10, 10)  # 6,000 samples with 300 features each
#
# for i, e in enumerate(example_embeddings):
#     print("{")
#     print(f"    \"id\": {i},")
#     print(f"    \"embedding\": {e.tolist()}")
#     print("},")
# print(example_embeddings)
# example_labels = np.random.randint(0, 10, size=6000)  # Optional: 10 genres
#
# plot_genre_embeddings_tsne(example_embeddings, labels=example_labels)
