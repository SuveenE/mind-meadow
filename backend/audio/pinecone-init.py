from embed_text import embed_text
from pinecone import Pinecone
from datetime import datetime
from dotenv import load_dotenv
import os

# Initialize Pinecone
load_dotenv()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("memory")

# Embed the text
text = "I want to buy banana, milk and bread from the supermarket today."
embedded_text = embed_text(text)

# Create metadata with timestamp
metadata = {
    "text": text,
    "timestamp": datetime.now().isoformat()  # current timestamp
}

# Upsert into Pinecone index with metadata
index.upsert(vectors=[{
    "id": "unique-id",  # replace with a unique ID
    "values": embedded_text,  # embedded text vector
    "metadata": metadata  # metadata with timestamp
}])

print(index)
