from datetime import datetime
from audio.embed_text import embed_text
from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("memory")

def store_in_pinecone(text):
    embedding = embed_text(text)
    timestamp = datetime.now().isoformat()
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
def query_pinecone(time_threshold=30):
    query_embedding = embed_text('and')
    results = index.query(
        vector=query_embedding,
        top_k=100,
        include_metadata=True
    )

    time_format = "%Y-%m-%dT%H:%M:%S.%f"

    # Filter by timestamp manually
    filtered_results = []
    for item in results.matches:
        try:
            # Parse the timestamp into a datetime object
            item_timestamp = datetime.strptime(item['metadata']['timestamp'], time_format)
            
            # Convert time_threshold to a comparable datetime if it's a timestamp (adjust if necessary)
            # Assuming time_threshold is a Unix timestamp, convert it to datetime for comparison
            if item_timestamp.timestamp() >= datetime.now().timestamp() + time_threshold:
                filtered_results.append(item)
        except ValueError as e:
            print(f"Error parsing timestamp: {e}")
    convo_summary = ""
    for match in filtered_results:
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

print(query_pinecone())