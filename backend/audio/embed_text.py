import os
# from chroma_db import store_in_chroma
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Embedding function
def embed_text(text):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

# def process_and_store_chroma(text, timestamp, chroma_collection):
    # embedding = embed_text(text)
    # store_in_chroma(chroma_collection, text, embedding, timestamp)
