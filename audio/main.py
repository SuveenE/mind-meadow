import time
from llm import summarize_conversation
from chroma_db import get_chroma_client, create_chroma_collection, query_chroma
from embed_text import process_and_store_chroma
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    # Initialize ChromaDB client and create a collection
    client = get_chroma_client()
    collection = create_chroma_collection(client)

    while True:
        text = "GPT-4o mini (“o” for “omni”) is our most advanced model in the small models category, and our cheapest model yet. It is multimodal (accepting text or image inputs and outputting text), has higher intelligence than gpt-3.5-turbo but is just as fast. It is meant to be used for smaller tasks, including vision tasks."  
        timestamp = time.time()

        # Store the embedding and text in ChromaDB
        process_and_store_chroma(text, timestamp, collection)
        logging.info(f"Stored text at {timestamp}: {text}")  

        # Query for topics in the last 30 seconds
        time_threshold = (datetime.now() - timedelta(seconds=30)).timestamp()
        results = query_chroma(collection, time_threshold)
        topic = summarize_conversation(results)
        logging.info(f"Topic from last {30} seconds: {topic}")
        
        time.sleep(10)  

if __name__ == "__main__":
    main()
