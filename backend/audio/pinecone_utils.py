from audio.embed_text import embed_text
from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("memory")

def store_in_pinecone(index, text, embedding, timestamp):
    index.upsert(
        vectors=[
            {
                "id": str(timestamp),  # unique ID using timestamp
                "values": embedding,   # the embedding vector
                "metadata": {"text": text, "timestamp": timestamp}
            }
        ]
    )

# Query Pinecone for recent conversation embeddings based on time threshold
def query_pinecone(index, time_threshold):
    # Pinecone doesn't support direct range filtering in queries
    # So we fetch all and filter locally (or in a pre-processing layer)
    results = index.query(
        top_k=1000,  # You may limit this according to your needs
        include_metadata=True
    )

    # Filter by timestamp manually
    filtered_results = [item for item in results['matches'] if item['metadata']['timestamp'] >= time_threshold]
    convo_summary = ""
    for match in filtered_results.matches:
        convo_summary += match.metadata["text"]
    return convo_summary

# Function to query the Pinecone index by a query text
def recall_things(query, n_results=2):
    query_embedding = embed_text(query)
    results = index.query(
        vector=query_embedding,
        top_k=n_results,
        include_metadata=True
    )

    convo_summary = ""
    for match in results.matches:
        convo_summary += match.metadata["text"]
    return convo_summary

# Retrieve all embeddings and their metadata from the Pinecone index
def get_all_embeddings_stuff(index):
    results = index.describe_index_stats()
    return results

