import chromadb
from chromadb.config import Settings

# Initialize the ChromaDB client with the updated configuration
def get_chroma_client():
    client = chromadb.Client()
    return client

# Create a collection (like a table) for storing embeddings
def create_chroma_collection(client, collection_name="conversation_collection"):
    collection = client.create_collection(name=collection_name)
    return collection

# Store conversation embeddings in the collection
def store_in_chroma(collection, text, embedding, timestamp):
    collection.upsert(
        documents=[text],
        embeddings=[embedding],
        metadatas=[{"timestamp": timestamp}],
        ids=[str(timestamp)]
    )

# Query Chroma for recent conversation embeddings
def query_chroma(collection, time_threshold):
    results = collection.get(
        where={"timestamp": {"$gte": time_threshold}}
    )
    return results
